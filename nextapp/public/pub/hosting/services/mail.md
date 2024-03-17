# Mail Transport Agent, for email routing and mailboxes management

Email is a must have for an organization, at least to ensure a widely used protocol for electronic communications.

## Product Matrix

stalwart-mail : Open source | Rust | secure from the ground and native support for additional SMTP security layers (DMARK, DKIM)

## Rely on the LDAP directory

Using the LDAP directory as the users registry is offered in many mail products.

Stalwart offers this integration in a flexible manner and it is already great.

The documentation offers to rely on PosixAccount and PosixGroup object classes but this doesn't fill well
with my needs.

Unfortunately stardadized LDAP objects are not handling properly the specific needs of a MTA while offering some mail related fields, that shoud be used for identity rather than for the MTA user profile and accesses.

We can see also a lot of schema published arond various MTA, but there is no standardized schema with a RFC.

It exist however a few IETF drafts that attempt to solve the issue

https://tools.ietf.org/html/draft-srivastava-ldap-mail-00
https://tools.ietf.org/html/draft-lachman-ldap-mail-routing-03
https://tools.ietf.org/html/draft-steinback-ldap-mailgroups-00

and a LDAP schema published by debops that implements them under an unified OID

https://github.com/debops/debops/blob/master/ansible/roles/slapd/files/etc/ldap/schema/debops/mailservice.schema

I'll be willing to lead a PR (mostly doc and some code here and there) that publish a stalwart specific schema extension, offering a clear and smooth LDAP integration and setup assistant.

For it to be well done in the state of the art, I will need to use a specific OID identification number that is standardized and contains a IANA that is registered for the entity publishing the shema.
Unfortunately, as far as i know, there is no stalwart IANA PEN number registered.
https://www.iana.org/assignments/enterprise-numbers/?q=stalwart

The registration is quite straightforward and would allow to offer the system admisitrator a dedicated schema for the stalwart user database and configuration.

https://www.iana.org/assignments/enterprise-numbers/assignment/apply/

Please let me know if you're interressed in such a contribution, amd if so, to apply stalwart for a IANA number.

Best regards

## Extending the LDAP schema

The above drafts are describing the following set of attributes and objectClasses 

```{mermaid}
---
LDAP schema for mail (MTA and MS)
---
classDiagram
    note "Mail Transport Agent and Mail agent objectClasses for LDAP"

    class mailRecipient~AUXILIARY~ {
        + mailAddress
        + mail
        - mailAlternateAddress
        - mailPrivateAddress
        - mailContactAddress 
        - mailEnvelopeAddress
        - mailRoutingAddress 
        - mailExternalAddress
        - mailInternalAddress
        - mailSenderBccTo 
        - mailRecipientBccTo
        - mailHost
        - mailTransport
        - mailUidNumber
        - mailGidNumber 
        - mailHomeDirectory
        - mailMessageStore
        - mailQuota
        - mailGroupACL 
        - mailExpungeTrash
        - mailSieveRuleSource
        - mailDeliveryOption 
        - mailProgramDeliveryInfo
        - cn
        - description
        - uid
        - userPassword
    }
    class mailAlias~STRUCTURAL~ {
        + mailAddress
        + mail
        - mailForwardTo
        - mailForwardToURL
        - mailHost
        - mailTransport 
        - mailDeliveryFile
        - mailDeliveryOption
        - mailProgramDeliveryInfo 
        - cn
        - description
        - owner

    }
    class mailDistributionList~AUXILIARY~ {
        + mailAddress
        + mail
        - mailForwardTo
        - mailForwardToURL
        - mailEnvelopeAddress
        - mailErrorsTo 
        -  mailRequestsTo
        - mailSuppressErrors
        - mailHost
        - mailTransport 
        - mailDeliveryFile
        - mailDeliveryOption
        - mailProgramDeliveryInfo 
        -  mailAuthorizedDomain
        - mailAuthorizedSender
        - mailUnauthorizedDomain 
        -  mailUnauthorizedSender
        - mailRemoveHeader
        - mailAddHeader 
        -  cn
        - description
        - owner
        - manager
        - seeAlso 

    }
    class MailDomain~STRUCTURAL~ {
        - mailHost
        - mailTransport
        - mailSenderBccTo
        - mailRecipientBccTo 
        - mailErrorsTo
        - mailSuppressErrors
        - mailAuthorizedDomain 
        - mailAuthorizedSender
        - mailUnauthorizedDomain
        - mailUnauthorizedSender 
        - mailRemoveHeader
        - mailAddHeader
        - description
        - owner
        - manager


    }
    class mailFilter~AUXILIARY~ {
        - mailAntispamPolicy
        - mailAntivirusPolicy
        - mailContentPolicy
        - cn
        - description
        - seeAlso

    }
  
```


