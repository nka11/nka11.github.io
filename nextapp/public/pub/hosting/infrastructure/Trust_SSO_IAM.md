
## CA and certificate management

```{mermaid}
graph TD
    C(Secure endpoint)
    C -->|Request Certificate| A
    A[Certificate Authority] -->|Emit Certificate| C
    D[Computer] --> C
    E[smartPhone] --> C
    C --> Service
```

## Identities and access management



Central reference of identities

SSO IdP (SAML & OIDC)

Access Control and Authorization management