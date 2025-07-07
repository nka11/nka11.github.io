import { Literal } from 'oxigraph';
export interface IOrganizationRole {
    roleName: Literal | null;
    employer: Literal | null;
    startDate: Literal | null;
    endDate: Literal | null;
    description: Literal | null;
    place: Literal | null;
    identifier: Literal | null
    }

export interface IProjectDetail {
    credentialName: Literal | null;
    projectName: Literal | null;
    projectDescription: Literal | null;
    projectStartDate: Literal | null;
    projectEndDate: Literal | null
  };

  export interface ICredentialDetails {
    credentialName: Literal | null;
    credentialIdentifier: Literal | null;
    credentialDescription: Literal | null;
    credentialEndDate: Literal | null;
    credentialStartDate: Literal | null
  };