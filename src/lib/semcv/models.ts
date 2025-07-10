import { BlankNode, Literal, NamedNode } from 'oxigraph';

export interface IPersonDetails {
    person: NamedNode;
    name: Literal | null;
    lang: Literal | null;
    email: Literal | null;
    jobTitle: Literal | null;
    decription: Literal | null
    }

export interface IOrganizationRole {
    role: NamedNode;
    roleName: Literal | null;
    employer: Literal | null;
    startDate: Literal | null;
    endDate: Literal | null;
    description: Literal | null;
    place: Literal | null;
    identifier: Literal | null
    }

export interface IProjectDetail {
    project: NamedNode,
    projectName: Literal | null;
    projectDescription: Literal | null;
    projectStartDate: Literal | null;
    projectEndDate: Literal | null
  };

export interface ICredentialDetails {
    credential: NamedNode,
    credentialName: Literal | null;
    credentialIdentifier: Literal | null;
    credentialDescription: Literal | null;
    credentialEndDate: Literal | null;
    credentialStartDate: Literal | null
  };

export interface IEducationDetails {
    educ: NamedNode,
    educName: Literal | null;
    educLocationName: Literal | null;
    educLocationAddress: Literal | null;
    educLevel: Literal | null;
    educStart: Literal | null;
    educEnd: Literal | null
  };

  export interface ISkillsDetails {
    skill: NamedNode,
    skillLabel: Literal | null,
    parentSkillName: Literal | null
  };

export interface ISkillsCount {
  skillName: Literal,
  count: Literal
}