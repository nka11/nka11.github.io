---
title: "Bootstrapping PKI and Secrets Management: Solving the Chicken-and-Egg Problem"
description: "How to bootstrap secure infrastructure when your secrets manager needs secrets to exist - a practical guide using YubiKey PKI and Vaultwarden"
slug: bootstrapping-pki-vault-chicken-egg
date: "2026-01-08"
tags:
  - infrastructure
  - security
  - pki
  - vault
  - open-source
  - devops
image: '/images/iagen/BootstrapPKIVault.png'
# In the [next article](/articles/identity-provider-authentik-infrastructure), we'll build on this foundation to deploy Authentik as our identity provider, using the PKI for TLS and Vaultwarden for credentials.

---

# Bootstrapping PKI and Secrets Management: The Chicken-and-Egg Problem

Every infrastructure team faces the same paradox when starting fresh: **you need a secrets manager to store secrets securely, but your secrets manager needs secrets to run**. The database password for Vaultwarden needs to be stored somewhere secure—but Vaultwarden doesn't exist yet. Your TLS certificates need a CA to sign them, but the CA configuration needs to be protected.

This article provides a practical solution to this bootstrap problem using pure open source tools: **YubiKey-backed PKI** and **Vaultwarden**. We'll walk through the exact sequence of operations, identifying which secrets must be kept manually during bootstrap and when they can finally be migrated into your secrets manager.

## The Bootstrap Paradox

Let's visualize the dependency chain:

```
Vaultwarden (secrets manager)
    └── needs PostgreSQL credentials
    └── needs TLS certificate
            └── needs Subordinate CA
                    └── needs Root CA
                            └── needs YubiKey PIN & Management Key
```

And the reverse dependency:

```
Where do we store the PostgreSQL password?
    └── In Vaultwarden... but Vaultwarden needs it to start

Where do we store the CA management key?
    └── In Vaultwarden... but Vaultwarden needs the CA for TLS
```

**The solution**: Accept that some secrets must exist outside the secrets manager during bootstrap, then migrate them once the infrastructure is operational.

## The Bootstrap Secrets Inventory

Before we begin, let's categorize our secrets by their lifecycle:

### Tier 0: Forever Offline (Never in Vaultwarden)

| Secret | Storage | Rationale |
|--------|---------|-----------|
| Root CA YubiKey PIN | Memory + sealed envelope | Required for signing ceremonies only |
| Root CA Management Key | Encrypted USB in safe | Rarely needed, highest security |
| YubiKey PUK | Sealed envelope | PIN recovery only |

### Tier 1: Bootstrap Secrets (Temporary Manual Storage)

| Secret | Initial Storage | Final Storage | Migration Trigger |
|--------|-----------------|---------------|-------------------|
| Subordinate CA key password | Text file on bastion | Vaultwarden | After Vaultwarden operational |
| Vaultwarden DB password | Environment variable | Vaultwarden | After first login |
| Vaultwarden admin token | `.env` file | Vaultwarden | After admin account created |
| Initial SSH keys | Local machine | Vaultwarden | After first login |

### Tier 2: Operational Secrets (Born in Vaultwarden)

| Secret | Created When | Notes |
|--------|--------------|-------|
| Service database credentials | Service deployment | Generated, never seen in plaintext |
| API keys | Integration setup | Rotatable |
| Automation tokens | CI/CD setup | Scoped, rotatable |

## Phase 1: Establishing the Root of Trust

The root CA private key is generated and stored inside the YubiKey's HSM—it **never exists in system memory or on disk**. This is a critical distinction from software-based CAs: even if your machine is compromised, the private key cannot be extracted.

### Understanding the Security Model

| Threat | YubiKey Protects? | Air-Gap Protects? |
|--------|-------------------|-------------------|
| Key extraction/theft | **Yes** (HSM) | Redundant |
| Remote key usage while PIN cached | No | **Yes** |
| CSR manipulation during signing | No | **Yes** |
| Rogue certificate issuance | No | **Yes** |
| Malware capturing PIN | No | **Yes** |

The residual risk with a networked machine is **misuse of the key, not theft of the key**. An attacker who compromises the machine during a signing ceremony could potentially swap the CSR being signed or capture the PIN—but they cannot steal the key itself.

### Security Level Options

Choose the approach that matches your threat model:

**High-Security (Enterprise/Compliance)**:
- Use an air-gapped machine for all root CA operations
- Protects against real-time attacks during ceremonies
- Required for compliance frameworks (PCI-DSS, SOC2, etc.)
- Hardware: Dedicated laptop, YubiKey, USB drive for transfers

**Pragmatic (Personal/Homelab)**:
- Use the YubiKey on a trusted, hardened workstation
- Enable touch-to-sign for all operations
- Never write PIN to files—enter interactively only
- Verify all CSRs carefully before signing
- Keep ceremonies brief and focused

For most personal infrastructure, the YubiKey's HSM properties provide sufficient protection. The instructions below work for both approaches—simply skip the air-gap and USB transfer steps if using the pragmatic approach.

### Hardware Requirements

- YubiKey 5 (or 4) with PIV support
- **For high-security**: Dedicated air-gapped laptop + USB drive for transfers
- **For pragmatic**: Your regular trusted workstation

### YubiKey Initialization

```bash
# Install required packages
sudo apt install openssl opensc yubikey-manager yubico-piv-tool pkcs11-provider

# Reset PIV application (DESTRUCTIVE)
ykman piv reset

# Set new PIN (default: 123456)
# WRITE THIS DOWN - Tier 0 secret
ykman piv access change-pin

# Set new PUK (default: 12345678)
# WRITE THIS DOWN - Tier 0 secret
ykman piv access change-puk

# Generate management key with touch requirement
# WRITE THIS DOWN and store offline - Tier 0 secret
key=$(openssl rand -hex 32)
echo "Management Key: $key"
ykman piv access change-management-key --touch --algorithm AES256 --new-management-key $key

# Enable touch requirement for signing operations (RECOMMENDED)
# This requires physical presence for every signature
ykman piv keys set-touch-policy 9c always
```

**Critical**: Write these three values on paper. Store in separate sealed envelopes in a physical safe. These never enter any digital system except the YubiKey itself.

**About touch-to-sign**: The `--touch` flag and touch policy mean you must physically touch the YubiKey for each cryptographic operation. This is your defense against remote attacks—even if an attacker has your PIN, they cannot sign anything without physical access to the device.

### Root CA Certificate Generation

```bash
# Generate key in YubiKey slot 9C (Digital Signature)
# The private key is created INSIDE the YubiKey - it never touches your system
ykman piv keys generate 9c root-ca-public.pem

# Create OpenSSL config
cat > root-ca.cnf << 'EOF'
openssl_conf = openssl_init

[openssl_init]
providers = provider_sect

[provider_sect]
default = default_sect
pkcs11 = pkcs11_sect

[default_sect]
activate = 1

[pkcs11_sect]
module = /usr/lib/x86_64-linux-gnu/ossl-modules/pkcs11.so
pkcs11-module-path = /usr/lib/x86_64-linux-gnu/opensc-pkcs11.so
activate = 1

[ req ]
default_md = sha384
prompt = no
distinguished_name = dn
x509_extensions = v3_ca

[ dn ]
C  = FR
O  = YourOrganization
OU = Internal PKI
CN = YourOrg Root CA

[ v3_ca ]
basicConstraints = critical, CA:TRUE, pathlen:1
keyUsage = critical, keyCertSign, cRLSign
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always
EOF

# Generate self-signed root certificate (20 years)
# OpenSSL will prompt for PIN interactively
OPENSSL_CONF=root-ca.cnf openssl req -new -x509 -days 7300 -sha384 \
    -key "pkcs11:id=%02;type=private;pin-value=prompt" \
    -out root-ca.crt
# Touch the YubiKey when it blinks

# Import certificate to YubiKey
ykman piv certificates import 9c root-ca.crt

# CLEANUP: Destroy config file
shred -u root-ca.cnf
```

> **Note**: The `pin-value=prompt` tells OpenSSL to ask for the PIN interactively rather than reading it from a file. This is more secure for the pragmatic approach. If you're on an air-gapped machine and prefer a PIN file, use `pkcs11-module-token-pin = file:pin.txt` in the config and `shred -u pin.txt` afterward.

### Distributing the Root Certificate

The root certificate (public, not secret) needs to be distributed to systems that will trust your PKI.

**For high-security (air-gapped)**:
```bash
# Copy to USB drive
cp root-ca.crt /media/usb/
cp root-ca-public.pem /media/usb/

# Verify before unmounting
openssl x509 -in /media/usb/root-ca.crt -noout -text | head -20

# Shutdown the air-gapped machine until the next signing ceremony
```

**For pragmatic approach**:
```bash
# Verify the certificate
openssl x509 -in root-ca.crt -noout -text | head -20

# Copy to your PKI directory
mkdir -p /opt/pki/root
cp root-ca.crt root-ca-public.pem /opt/pki/root/

# Store the YubiKey securely when not in use
```

The YubiKey should be stored securely (locked drawer, safe) when not actively performing signing operations. Even without air-gapping, physical control of the YubiKey is your primary security control.

## Phase 2: Subordinate CA (Online, But Protected)

The subordinate CA runs on your bastion/management server. Its private key is software-based but protected by a passphrase.

### Creating the Subordinate CA Key

```bash
# On your bastion server
mkdir -p /opt/pki/subca
cd /opt/pki/subca

# Generate subordinate CA key WITH passphrase
# This passphrase is a Tier 1 bootstrap secret
openssl genrsa -aes256 -out subca.key 4096
# Enter passphrase when prompted - WRITE IT DOWN

# Generate CSR
openssl req -new -key subca.key -out subca.csr \
    -subj "/C=FR/O=YourOrg/OU=PKI/CN=YourOrg Subordinate CA"
```

### Signing with Root CA

This is a "signing ceremony"—you'll need your YubiKey and PIN.

**For high-security**: Transfer `subca.csr` to the air-gapped machine via USB, perform the signing, then transfer `subca.crt` back.

**For pragmatic**: Perform the signing on your trusted workstation with the YubiKey inserted.

```bash
# Prepare signing environment
mkdir -p subca-signing/newcerts
cd subca-signing
touch index.txt
echo "01" > serial

# Copy the root CA certificate (from USB or /opt/pki/root/)
cp /path/to/root-ca.crt .

# Create signer config
cat > signer.cnf << 'EOF'
openssl_conf = openssl_init

[openssl_init]
providers = provider_sect

[provider_sect]
default = default_sect
pkcs11 = pkcs11_sect

[default_sect]
activate = 1

[pkcs11_sect]
module = /usr/lib/x86_64-linux-gnu/ossl-modules/pkcs11.so
pkcs11-module-path = /usr/lib/x86_64-linux-gnu/opensc-pkcs11.so
pkcs11-module-quirks = no-operation-state
activate = 1

[ ca ]
default_ca = CA_default

[ CA_default ]
dir = .
database = $dir/index.txt
new_certs_dir = $dir/newcerts
serial = $dir/serial
certificate = root-ca.crt
private_key = pkcs11:id=%02;type=private;pin-value=prompt
default_days = 3650
default_md = sha384
preserve = no
policy = policy_loose
copy_extensions = copy

[ policy_loose ]
countryName = optional
organizationName = optional
commonName = supplied

[ v3_sub_ca ]
basicConstraints = critical, CA:TRUE, pathlen:0
keyUsage = critical, keyCertSign, cRLSign
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
EOF

# IMPORTANT: Verify the CSR before signing!
openssl req -in subca.csr -noout -text

# Sign the subordinate CA
# Enter PIN when prompted, touch YubiKey when it blinks
export OPENSSL_CONF=$(pwd)/signer.cnf
openssl ca -extensions v3_sub_ca \
    -in subca.csr \
    -out subca.crt \
    -batch

# Cleanup
shred -u signer.cnf
```

**For high-security**: Transfer `subca.crt` back to the bastion via USB, then shutdown the air-gapped machine.

### Storing the Subordinate CA Passphrase (Bootstrap Secret)

At this point, the subordinate CA passphrase exists only in your memory and possibly written down. This is a **Tier 1 bootstrap secret** that will be migrated to Vaultwarden later.

For now, if you need automation (e.g., issuing certificates automatically):

```bash
# Create a temporary passphrase file with restrictive permissions
echo "your-subca-passphrase" > /opt/pki/subca/.passphrase
chmod 600 /opt/pki/subca/.passphrase
chown root:root /opt/pki/subca/.passphrase
```

**Note**: This file will be deleted after Vaultwarden is operational and the passphrase is stored there.

## Phase 3: Deploying Vaultwarden (The Critical Bootstrap)

Now comes the chicken-and-egg moment. Vaultwarden needs:
1. A PostgreSQL database with credentials
2. TLS certificates (from our PKI)
3. An admin token

None of these can be stored in Vaultwarden yet because Vaultwarden doesn't exist.

### Generating Bootstrap Credentials

```bash
# Generate secure credentials
# These are Tier 1 bootstrap secrets

# PostgreSQL password
POSTGRES_PASSWORD=$(openssl rand -base64 32)
echo "Vaultwarden DB Password: $POSTGRES_PASSWORD"
# WRITE THIS DOWN

# Vaultwarden admin token
ADMIN_TOKEN=$(openssl rand -base64 48)
echo "Vaultwarden Admin Token: $ADMIN_TOKEN"
# WRITE THIS DOWN
```

### Issuing TLS Certificate for Vaultwarden

Using the subordinate CA:

```bash
cd /opt/pki/subca

# Generate Vaultwarden server key
openssl genrsa -out vaultwarden.key 2048

# Generate CSR
openssl req -new -key vaultwarden.key -out vaultwarden.csr \
    -subj "/CN=vault.internal.local"

# Create extensions file
cat > vaultwarden.ext << EOF
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = DNS:vault.internal.local,DNS:localhost,IP:127.0.0.1
EOF

# Sign with subordinate CA
openssl x509 -req -in vaultwarden.csr \
    -CA subca.crt -CAkey subca.key \
    -CAcreateserial -out vaultwarden.crt \
    -days 365 -sha256 -extfile vaultwarden.ext
# Enter subordinate CA passphrase when prompted

# Create certificate chain
cat vaultwarden.crt subca.crt > vaultwarden-chain.crt
```

### Docker Compose Deployment

```yaml
# /opt/vaultwarden/docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: vaultwarden-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: vaultwarden
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: vaultwarden
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - vaultwarden-net

  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    restart: unless-stopped
    depends_on:
      - postgres
    environment:
      DATABASE_URL: postgresql://vaultwarden:${POSTGRES_PASSWORD}@postgres/vaultwarden
      ADMIN_TOKEN: ${ADMIN_TOKEN}
      DOMAIN: https://vault.internal.local
      SIGNUPS_ALLOWED: "true"  # DISABLE AFTER INITIAL SETUP
      ROCKET_TLS: '{certs="/ssl/vaultwarden-chain.crt",key="/ssl/vaultwarden.key"}'
    volumes:
      - vaultwarden-data:/data
      - /opt/pki/subca/vaultwarden-chain.crt:/ssl/vaultwarden-chain.crt:ro
      - /opt/pki/subca/vaultwarden.key:/ssl/vaultwarden.key:ro
    ports:
      - "443:80"
    networks:
      - vaultwarden-net

volumes:
  postgres-data:
  vaultwarden-data:

networks:
  vaultwarden-net:
```

Create the environment file with bootstrap secrets:

```bash
# /opt/vaultwarden/.env
# THIS FILE CONTAINS BOOTSTRAP SECRETS
# It will be secured after Vaultwarden is operational

POSTGRES_PASSWORD=<your-generated-password>
ADMIN_TOKEN=<your-generated-token>
```

```bash
chmod 600 /opt/vaultwarden/.env
```

### Starting Vaultwarden

```bash
cd /opt/vaultwarden
docker compose up -d

# Verify it's running
docker compose logs -f vaultwarden
```

## Phase 4: Migrating Bootstrap Secrets into Vaultwarden

Now that Vaultwarden is running, we migrate our Tier 1 secrets into it.

### Initial Account Creation

1. Access `https://vault.internal.local` (via SSH tunnel if needed)
2. Create your admin account with a strong master password
3. Enable MFA immediately (TOTP or WebAuthn)

### Creating the Infrastructure Vault

Organize secrets by category:

```
Infrastructure (Organization)
├── PKI (Collection)
│   ├── Subordinate CA Passphrase
│   └── Certificate Renewal Notes
├── Databases (Collection)
│   ├── Vaultwarden PostgreSQL
│   └── (future services)
├── Automation (Collection)
│   ├── Vaultwarden Admin Token
│   └── (future API keys)
└── Bootstrap Recovery (Collection)
    └── Initial Setup Documentation
```

### Migrating Each Secret

**Subordinate CA Passphrase**:
1. Create new item in PKI collection
2. Store the passphrase
3. Delete `/opt/pki/subca/.passphrase`:
   ```bash
   shred -u /opt/pki/subca/.passphrase
   ```

**Vaultwarden PostgreSQL Password**:
1. Create new item in Databases collection
2. Store username, password, connection string
3. The `.env` file still needs this for Docker, but now you have a backup

**Vaultwarden Admin Token**:
1. Create new item in Automation collection
2. Store the token
3. Now you can recover admin access if needed

### Securing the Environment File

The `.env` file must remain for Docker Compose, but now it's backed up in Vaultwarden:

```bash
# Verify secrets are in Vaultwarden first!

# Restrict access further
chmod 400 /opt/vaultwarden/.env
chown root:root /opt/vaultwarden/.env
```

### Disabling Public Signups

Now that your accounts are created:

```bash
# Edit docker-compose.yml
# Change: SIGNUPS_ALLOWED: "false"

# Restart
docker compose down && docker compose up -d
```

## Phase 5: Operational Procedures

With the bootstrap complete, establish operational procedures.

### Certificate Issuance Workflow

For new services requiring TLS:

1. **Retrieve subordinate CA passphrase** from Vaultwarden
2. **Generate key and CSR** on target server
3. **Sign with subordinate CA** using retrieved passphrase
4. **Store new service credentials** in Vaultwarden
5. **Clear passphrase from memory/clipboard**

```bash
# Example: Issue certificate for new service
cd /opt/pki/subca

# Get passphrase from Vaultwarden CLI
export SUBCA_PASS=$(bw get password "Subordinate CA Passphrase")

# Generate and sign
openssl genrsa -out newservice.key 2048
openssl req -new -key newservice.key -out newservice.csr \
    -subj "/CN=newservice.internal.local"

openssl x509 -req -in newservice.csr \
    -CA subca.crt -CAkey subca.key -passin env:SUBCA_PASS \
    -CAcreateserial -out newservice.crt -days 365

# Clear passphrase
unset SUBCA_PASS
```

### Root CA Ceremony (Rare)

When you need the root CA (new subordinate CA, revocation):

**For high-security**:
1. **Retrieve YubiKey** from secure storage
2. **Power on air-gapped machine**
3. **Perform operation** (signing, revocation)
4. **Transfer artifacts** via USB
5. **Shutdown and secure** everything

**For pragmatic**:
1. **Retrieve YubiKey** from secure storage
2. **Insert into trusted workstation**
3. **Verify CSR/request** before signing
4. **Perform operation** (enter PIN, touch to sign)
5. **Remove and secure YubiKey** when done

In both cases, the YubiKey's HSM ensures the private key never leaves the device. The difference is whether you also protect against real-time machine compromise during the ceremony.

### Backup Strategy

| Component | Method | Frequency | Storage |
|-----------|--------|-----------|---------|
| Vaultwarden DB | `pg_dump` encrypted | Daily | Off-site S3 |
| Vaultwarden data volume | Volume backup | Daily | Off-site S3 |
| Subordinate CA | Manual export | On change | Vaultwarden + offline |
| Root CA | YubiKey physical | N/A | Safe deposit box |

## The Complete Bootstrap Timeline

| Day | Action | Secrets Created | Secrets Migrated |
|-----|--------|-----------------|------------------|
| 0 | Root CA ceremony | YubiKey PIN, PUK, Mgmt Key | None (Tier 0) |
| 1 | Subordinate CA | SubCA passphrase | None |
| 1 | Generate Vaultwarden creds | DB password, Admin token | None |
| 1 | Issue Vaultwarden TLS | (using SubCA) | None |
| 1 | Deploy Vaultwarden | - | - |
| 2 | Create admin account | Master password | - |
| 2 | **Migrate secrets** | - | SubCA pass, DB pass, Admin token |
| 2 | Delete bootstrap files | - | - |
| 2+ | Operational mode | Born in Vaultwarden | - |

## Automation Considerations

Once Vaultwarden is operational, you can automate certificate issuance:

### Using Vaultwarden CLI

```bash
# Install Bitwarden CLI (compatible with Vaultwarden)
npm install -g @bitwarden/cli

# Configure for Vaultwarden
bw config server https://vault.internal.local

# Login and unlock
bw login
export BW_SESSION=$(bw unlock --raw)

# Retrieve secrets in scripts
SUBCA_PASS=$(bw get password "Subordinate CA Passphrase")
```

### Ansible Integration

```yaml
# Example: Certificate issuance playbook
- name: Retrieve SubCA passphrase
  set_fact:
    subca_passphrase: "{{ lookup('bitwarden', 'Subordinate CA Passphrase', field='password') }}"
  no_log: true

- name: Sign certificate
  command: >
    openssl x509 -req -in {{ service_name }}.csr
    -CA /opt/pki/subca/subca.crt
    -CAkey /opt/pki/subca/subca.key
    -passin pass:{{ subca_passphrase }}
    -out {{ service_name }}.crt
  no_log: true
```

## Summary: Breaking the Chicken-and-Egg Cycle

The bootstrap problem is solved by accepting a **temporary trust hierarchy**:

1. **Human memory/paper** → holds Tier 0 secrets forever
2. **Temporary files** → hold Tier 1 secrets during bootstrap
3. **Vaultwarden** → receives Tier 1 secrets after it's operational
4. **Services** → receive secrets from Vaultwarden, never see bootstrap

The key insight: **some secrets must exist outside the system temporarily, but the window is short and well-defined**. By Day 2, all operational secrets are in Vaultwarden, and the temporary bootstrap files are destroyed.

### A Note on Air-Gapping

Traditional PKI guidance mandates air-gapped root CAs because software-based keys can be stolen. With a YubiKey HSM, the threat model changes fundamentally:

- **The private key cannot be extracted**—it's generated and used inside the YubiKey
- **Touch-to-sign requires physical presence**—remote attackers cannot sign
- **PIN protects against physical theft**—a stolen YubiKey is useless without the PIN

Air-gapping still provides defense-in-depth against sophisticated real-time attacks during signing ceremonies. Choose your security level based on your threat model: enterprise compliance may require air-gapping, while personal infrastructure can rely on the YubiKey's HSM properties with good operational practices.


---

*This article is based on Architecture Decision Records from production infrastructure deployments. The specific sequence and procedures have been tested in real-world scenarios.*
