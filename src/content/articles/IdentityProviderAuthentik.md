---
title: "Building Multi-Tenant Identity Infrastructure with Authentik"
description: "Deploying a self-hosted OIDC/SAML identity provider for multi-tenant SaaS applications using Authentik"
# slug: identity-provider-authentik-infrastructure
# date: "2026-01-08"
tags:
  - infrastructure
  - security
  - identity
  - oidc
  - open-source
  - authentik
image: /images/articles/authentik-idp.png
---

# Building Multi-Tenant Identity Infrastructure with Authentik

With [PKI and secrets management](/articles/bootstrapping-pki-vault-chicken-egg) established, we can now deploy the third pillar of secure infrastructure: **Identity Provider (IdP)**. This article covers deploying Authentik as a self-hosted OIDC/SAML provider for multi-tenant applications.

## Why Authentik?

Selecting an IdP required evaluating four serious contenders:

| Solution | Resource Usage | OIDC/SAML | Multi-Tenancy | Verdict |
|----------|---------------|-----------|---------------|---------|
| **Authentik** | 4-6 GB RAM | Full/Full | Brands + Groups | **Selected** |
| Keycloak | 6-10 GB RAM | Full/Full | Realms | Too heavy |
| Zitadel | 4-6 GB RAM | Full/Beta | Organizations | SAML immature |
| Ory (Hydra+Kratos) | 3 GB RAM | Full/None | Custom | No SAML, no UI |

Authentik won on three criteria:

1. **Resource efficiency**: PostgreSQL-only (removed Redis in 2025.10)
2. **Protocol support**: Complete OIDC and SAML 2.0 implementation
3. **Modern architecture**: Docker-native, API-first, visual flow designer

## Architecture Overview

For a multi-tenant SaaS platform, Authentik's structure maps naturally:

```
Authentik Instance
│
├── Brand: tenant-alpha (auth.alpha.example.com)
│   ├── Company Group: alpha:paris
│   │   ├── Role Group: alpha:paris:ADMIN
│   │   ├── Role Group: alpha:paris:USER
│   │   └── Role Group: alpha:paris:VIEWER
│   ├── Company Group: alpha:lyon
│   │   └── ...
│   └── Federation Source: Azure AD (optional)
│
├── Brand: tenant-beta (auth.beta.example.com)
│   ├── Company Group: beta:main
│   │   └── ...
│   └── Federation Source: Corporate LDAP
│
└── Applications
    ├── Main API (OIDC)
    ├── Admin Portal (OIDC)
    └── Legacy System (SAML)
```

**Key concepts**:
- **Brand**: Top-level tenant isolation with custom domain and branding
- **Company Group**: Organizational unit within a tenant
- **Role Group**: Permission level within a company
- **Federation Source**: External IdP delegation (Azure AD, LDAP, etc.)

## Deployment

### Prerequisites

From the [previous article](/articles/bootstrapping-pki-vault-chicken-egg):
- Subordinate CA operational
- Vaultwarden running with automation credentials

### Generating Credentials

Store all credentials in Vaultwarden before deployment:

```bash
# Generate secrets
AUTHENTIK_SECRET_KEY=$(openssl rand -base64 48)
AUTHENTIK_DB_PASSWORD=$(openssl rand -base64 32)
AUTHENTIK_BOOTSTRAP_PASSWORD=$(openssl rand -base64 24)

# Store in Vaultwarden via CLI
bw create item '{
  "name": "Authentik PostgreSQL",
  "login": {
    "username": "authentik",
    "password": "'$AUTHENTIK_DB_PASSWORD'"
  },
  "notes": "Database credentials for Authentik IdP"
}'

bw create item '{
  "name": "Authentik Secret Key",
  "secureNote": {
    "type": 0
  },
  "notes": "'$AUTHENTIK_SECRET_KEY'"
}'

bw create item '{
  "name": "Authentik Bootstrap Admin",
  "login": {
    "username": "akadmin",
    "password": "'$AUTHENTIK_BOOTSTRAP_PASSWORD'"
  }
}'
```

### TLS Certificate

Issue a certificate from your subordinate CA:

```bash
cd /opt/pki/subca

# Retrieve passphrase from Vaultwarden
SUBCA_PASS=$(bw get password "Subordinate CA Passphrase")

# Generate key and CSR
openssl genrsa -out authentik.key 2048
openssl req -new -key authentik.key -out authentik.csr \
    -subj "/CN=auth.example.com"

cat > authentik.ext << EOF
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = DNS:auth.example.com,DNS:auth.tenant-a.example.com,DNS:auth.tenant-b.example.com
EOF

# Sign
openssl x509 -req -in authentik.csr \
    -CA subca.crt -CAkey subca.key -passin pass:$SUBCA_PASS \
    -CAcreateserial -out authentik.crt -days 365 -sha256 \
    -extfile authentik.ext

cat authentik.crt subca.crt > authentik-chain.crt

# Clear passphrase
unset SUBCA_PASS
```

### Docker Compose Deployment

```yaml
# /opt/authentik/docker-compose.yml
version: "3.8"

services:
  postgresql:
    image: postgres:15-alpine
    container_name: authentik-db
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -d $${POSTGRES_DB} -U $${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    environment:
      POSTGRES_USER: authentik
      POSTGRES_PASSWORD: ${AUTHENTIK_DB_PASSWORD}
      POSTGRES_DB: authentik
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - authentik-net

  server:
    image: ghcr.io/goauthentik/server:2025.1
    container_name: authentik-server
    restart: unless-stopped
    command: server
    depends_on:
      postgresql:
        condition: service_healthy
    environment:
      AUTHENTIK_SECRET_KEY: ${AUTHENTIK_SECRET_KEY}
      AUTHENTIK_POSTGRESQL__HOST: postgresql
      AUTHENTIK_POSTGRESQL__USER: authentik
      AUTHENTIK_POSTGRESQL__PASSWORD: ${AUTHENTIK_DB_PASSWORD}
      AUTHENTIK_POSTGRESQL__NAME: authentik
      AUTHENTIK_BOOTSTRAP_PASSWORD: ${AUTHENTIK_BOOTSTRAP_PASSWORD}
      AUTHENTIK_BOOTSTRAP_EMAIL: admin@example.com
    volumes:
      - authentik-media:/media
      - authentik-templates:/templates
    networks:
      - authentik-net

  worker:
    image: ghcr.io/goauthentik/server:2025.1
    container_name: authentik-worker
    restart: unless-stopped
    command: worker
    depends_on:
      postgresql:
        condition: service_healthy
    environment:
      AUTHENTIK_SECRET_KEY: ${AUTHENTIK_SECRET_KEY}
      AUTHENTIK_POSTGRESQL__HOST: postgresql
      AUTHENTIK_POSTGRESQL__USER: authentik
      AUTHENTIK_POSTGRESQL__PASSWORD: ${AUTHENTIK_DB_PASSWORD}
      AUTHENTIK_POSTGRESQL__NAME: authentik
    volumes:
      - authentik-media:/media
      - authentik-templates:/templates
    networks:
      - authentik-net

  nginx:
    image: nginx:alpine
    container_name: authentik-proxy
    restart: unless-stopped
    depends_on:
      - server
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - /opt/pki/subca/authentik-chain.crt:/etc/nginx/ssl/cert.pem:ro
      - /opt/pki/subca/authentik.key:/etc/nginx/ssl/key.pem:ro
    networks:
      - authentik-net

volumes:
  postgres-data:
  authentik-media:
  authentik-templates:

networks:
  authentik-net:
```

Nginx configuration for TLS termination:

```nginx
# /opt/authentik/nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream authentik {
        server server:9000;
    }

    server {
        listen 443 ssl http2;
        server_name auth.example.com auth.*.example.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        location / {
            proxy_pass http://authentik;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }
}
```

Create the environment file:

```bash
# Retrieve secrets from Vaultwarden
cat > /opt/authentik/.env << EOF
AUTHENTIK_SECRET_KEY=$(bw get notes "Authentik Secret Key")
AUTHENTIK_DB_PASSWORD=$(bw get password "Authentik PostgreSQL")
AUTHENTIK_BOOTSTRAP_PASSWORD=$(bw get password "Authentik Bootstrap Admin")
EOF

chmod 600 /opt/authentik/.env
```

### Launch

```bash
cd /opt/authentik
docker compose up -d

# Watch logs for successful startup
docker compose logs -f server
```

## Multi-Tenant Configuration

### Creating Brands (Tenants)

In Authentik Admin Interface → Admin Interface → Brands:

1. **Create Brand** for each tenant:
   - Name: `tenant-alpha`
   - Domain: `auth.alpha.example.com`
   - Default: No (keep default for admin access)

2. **Configure Branding**:
   - Logo, favicon, colors
   - Custom CSS if needed

### Group Hierarchy

Create the hierarchical group structure:

```
# Via Admin Interface → Directory → Groups

tenant-alpha                          (Parent: None)
├── tenant-alpha:paris                (Parent: tenant-alpha)
│   ├── tenant-alpha:paris:ADMIN      (Parent: tenant-alpha:paris)
│   ├── tenant-alpha:paris:USER       (Parent: tenant-alpha:paris)
│   └── tenant-alpha:paris:VIEWER     (Parent: tenant-alpha:paris)
└── tenant-alpha:lyon
    └── ...
```

Or via Authentik API:

```bash
# Create tenant group
curl -X POST https://auth.example.com/api/v3/core/groups/ \
  -H "Authorization: Bearer $AUTHENTIK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "tenant-alpha",
    "is_superuser": false
  }'

# Create company group (child)
curl -X POST https://auth.example.com/api/v3/core/groups/ \
  -H "Authorization: Bearer $AUTHENTIK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "tenant-alpha:paris",
    "parent": "<tenant-alpha-uuid>",
    "is_superuser": false
  }'
```

### Custom User Attributes

Define attributes for users:

```yaml
# User attributes schema
attributes:
  tenant_id: "tenant-alpha"
  default_company: "paris"
  employee_id: "EMP-12345"
```

## OIDC Application Configuration

### Creating an OAuth2 Provider

1. **Admin Interface → Applications → Providers → Create**
2. **Type**: OAuth2/OpenID Provider
3. **Configuration**:
   - Name: `main-api-provider`
   - Authorization flow: `default-authorization-flow`
   - Client type: Confidential
   - Client ID: (auto-generated or custom)
   - Client Secret: (generate and store in Vaultwarden)
   - Redirect URIs: `https://api.example.com/callback`
   - Scopes: `openid email profile`

### Custom Scopes and Claims

Create application-specific scopes:

**Scope: `api.admin`**
```python
# Property Mapping Expression
return {
    "tenant_id": request.user.attributes.get("tenant_id"),
    "company_id": request.user.attributes.get("default_company"),
    "roles": [g.name.split(":")[-1] for g in request.user.ak_groups.all()
              if g.name.startswith(f"{request.user.attributes.get('tenant_id')}:{request.user.attributes.get('default_company')}")],
    "is_admin": request.user.ak_groups.filter(name__endswith=":ADMIN").exists()
}
```

### Token Structure

With proper configuration, tokens contain:

```json
{
  "iss": "https://auth.alpha.example.com",
  "sub": "user-uuid-12345",
  "aud": "main-api",
  "exp": 1735689600,

  "email": "user@alpha.example.com",
  "name": "Jean Dupont",

  "api.admin": {
    "tenant_id": "tenant-alpha",
    "company_id": "paris",
    "roles": ["ADMIN", "USER"],
    "is_admin": true
  },

  "scope": "openid email profile api.admin"
}
```

## Identity Federation

### Azure AD Integration

For tenants using Microsoft 365:

1. **Admin Interface → Applications → Providers → Create**
2. **Type**: OAuth2/OpenID Source
3. **Configuration**:
   - Name: `azure-ad-tenant-alpha`
   - Consumer Key: (from Azure AD app registration)
   - Consumer Secret: (store in Vaultwarden)
   - Authorization URL: `https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize`
   - Token URL: `https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token`
   - Userinfo URL: `https://graph.microsoft.com/oidc/userinfo`

4. **Group Mapping** (via Property Mapping):
```python
# Map Azure AD groups to Authentik groups
azure_groups = request.user.attributes.get("groups", [])
group_mapping = {
    "AZURE-ADMINS": "tenant-alpha:paris:ADMIN",
    "AZURE-USERS": "tenant-alpha:paris:USER"
}
return [group_mapping.get(g) for g in azure_groups if g in group_mapping]
```

### LDAP Integration

For enterprises with Active Directory:

1. **Admin Interface → Directory → Federations → Create**
2. **Type**: LDAP Source
3. **Configuration**:
   - Server URI: `ldaps://dc.corp.local:636`
   - Bind DN: `cn=authentik,ou=service,dc=corp,dc=local`
   - Bind Password: (from Vaultwarden)
   - Base DN: `dc=corp,dc=local`
   - User filter: `(objectClass=person)`
   - Group filter: `(objectClass=group)`

## API Integration Patterns

### JWT Validation (Backend)

Example FastAPI middleware:

```python
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
import jwt
from jwt import PyJWKClient

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
jwks_client = PyJWKClient("https://auth.example.com/application/o/main-api/.well-known/jwks.json")

async def validate_token(token: str = Depends(oauth2_scheme)):
    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            audience="main-api",
            issuer="https://auth.example.com/application/o/main-api/"
        )
        return payload
    except jwt.exceptions.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=str(e))

async def get_current_user(token_data: dict = Depends(validate_token)):
    return {
        "user_id": token_data["sub"],
        "tenant_id": token_data.get("api.admin", {}).get("tenant_id"),
        "company_id": token_data.get("api.admin", {}).get("company_id"),
        "roles": token_data.get("api.admin", {}).get("roles", [])
    }
```

### Data Isolation

All database queries scoped by `company_id`:

```python
@app.get("/missions")
async def list_missions(user: dict = Depends(get_current_user)):
    # Automatic company isolation
    return await db.missions.find({
        "company_id": user["company_id"]
    })
```

### Multi-Company Users

For users with access to multiple companies:

```json
{
  "api.admin": {
    "company_id": "paris",
    "available_companies": [
      {"id": "paris", "roles": ["ADMIN"]},
      {"id": "lyon", "roles": ["VIEWER"]}
    ]
  }
}
```

Future: Token exchange for company switching without re-authentication.

## Security Hardening

### Authentication Flows

Customize flows for security requirements:

1. **MFA Enforcement**:
   - Edit default authentication flow
   - Add MFA stage (TOTP or WebAuthn)
   - Set as required, not optional

2. **Password Policies**:
   - Minimum 12 characters
   - Complexity requirements
   - Breach database checking (haveibeenpwned)

3. **Session Management**:
   - Access token: 15 minutes
   - Refresh token: 30 days
   - Idle timeout: 24 hours

### Rate Limiting

Configure via flow policies:

```python
# Reputation Policy
if request.context.get("reputation_score", 0) < -5:
    return False, "Too many failed attempts"
return True
```

### Audit Logging

All events logged to Authentik's event system:

- Login attempts (success/failure)
- Token issuance
- Group membership changes
- Admin actions

Export to SIEM via:
- Syslog forwarding
- Webhook notifications
- API polling

## Monitoring and Operations

### Health Checks

```bash
# Authentik health endpoint
curl https://auth.example.com/-/health/ready/

# Database connectivity
docker compose exec postgresql pg_isready
```

### Backup Strategy

| Component | Method | Frequency |
|-----------|--------|-----------|
| PostgreSQL | `pg_dump` encrypted | Daily |
| Media files | Volume backup | Daily |
| Configuration | Export via API | On change |

```bash
# Database backup
docker compose exec postgresql pg_dump -U authentik authentik | \
  gzip | \
  openssl enc -aes-256-gcm -pbkdf2 -out authentik-$(date +%Y%m%d).sql.gz.enc
```

### Disaster Recovery

Recovery order:
1. Restore PostgreSQL database
2. Start Authentik containers
3. Verify admin access
4. Test OIDC flows for each application

## Integration with PKI and Vault

The complete security stack:

```
┌─────────────────────────────────────────────────────────────┐
│                     Service Request                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Authentik (IdP)                          │
│   - OIDC token issuance                                      │
│   - User authentication                                      │
│   - Group/role resolution                                    │
│   - TLS: Signed by Subordinate CA                           │
│   - Credentials: Stored in Vaultwarden                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Application API                          │
│   - Validates JWT from Authentik                            │
│   - Extracts tenant/company/roles                           │
│   - TLS: Signed by Subordinate CA                           │
│   - DB Credentials: From Vaultwarden                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Database                               │
│   - Data isolated by company_id                             │
│   - TLS: Signed by Subordinate CA                           │
│   - Credentials: In Vaultwarden                             │
└─────────────────────────────────────────────────────────────┘
```

Every component:
- Has TLS from the internal PKI
- Stores credentials in Vaultwarden
- Authenticates users via Authentik

## Conclusion

Authentik provides enterprise-grade identity management without enterprise resource requirements. Combined with YubiKey-backed PKI and Vaultwarden, you have a complete security infrastructure:

- **PKI**: Machine identity and encryption
- **Vaultwarden**: Secrets at rest
- **Authentik**: User identity and authorization

This stack is:
- **Self-hosted**: Full data sovereignty
- **Open source**: No licensing costs
- **Production-ready**: ISO 27001 compliant
- **Scalable**: From 10 to 10,000 users

The investment in proper identity infrastructure pays dividends in security, compliance, and developer experience. Every new service inherits secure defaults rather than requiring custom security implementation.

---

*This article is based on Architecture Decision Records from production multi-tenant SaaS deployments.*
