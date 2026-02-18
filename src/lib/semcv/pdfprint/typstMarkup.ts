import type {
  ICredentialDetails,
  IEducationDetails,
  IOrganizationRole,
  IPersonDetails,
  IPersonLangDetails,
  IProjectDetail,
  ISkillsCount,
  ISkillsDetails
} from "../models";
import type { NamedNode } from "oxigraph";
import { formatDateFr } from "$lib/dateFormatter";
import { getSectionHeaders } from "./cvSectionHeaders";

/**
 * Escape special Typst characters in text content.
 */
export function escapeTypst(text: string): string {
  return text.replace(/([#*_`$<>@\\])/g, '\\$1');
}

/**
 * Clean text: trim, skip empty/undefined lines.
 */
function cleanText(text: string | undefined | null): string {
  if (!text || text === "undefined") return "";
  return text.trim();
}

/**
 * Build the Typst document preamble with page setup, font, and heading rules.
 */
export function buildPreamble(lang: string): string {
  return `#set page(paper: "a4", margin: 20mm)
#set text(font: "Noto Sans", size: 10pt, lang: "${lang}")
#set par(justify: true)

#show heading.where(level: 1): it => {
  v(2pt)
  line(length: 100%, stroke: 0.5pt)
  v(2pt)
  text(size: 16pt, weight: "bold", it.body)
  v(4pt)
}

#show heading.where(level: 2): it => {
  v(1pt)
  text(size: 12pt, weight: "bold", it.body)
  v(1pt)
}

#show heading.where(level: 3): it => {
  v(1pt)
  line(length: 100%, stroke: 0.1pt)
  v(1pt)
  text(size: 12pt, weight: "bold", it.body)
  v(1pt)
}

`;
}

/**
 * Build the header section: name, link, job title, description.
 */
export function buildHeader(person: IPersonDetails): string {
  const name = cleanText(person.name?.value);
  const jobTitle = cleanText(person.jobTitle?.value);
  const description = cleanText(person.description?.value);

  let out = "";
  out += `#text(size: 22pt, weight: "bold")[${escapeTypst(name)}]\n\n`;
  out += `#text(size: 8pt)[#link("https://nka11.github.io/cv")[nka11.github.io/cv]]\n\n`;
  out += `#line(length: 100%, stroke: 0.5pt)\n\n`;
  out += `#text(size: 16pt)[${escapeTypst(jobTitle)}]\n\n`;
  if (description) {
    out += `#text(size: 10pt)[${escapeTypst(description)}]\n\n`;
  }
  out += `#line(length: 100%, stroke: 0.5pt)\n\n`;
  return out;
}

/**
 * Build a date range string based on lang.
 */
export function buildDateRange(
  startDate: string | undefined | null,
  endDate: string | undefined | null,
  lang: string
): string {
  if (!startDate && !endDate) return "";

  const isFr = lang === "fr";
  let result = "";

  if (startDate && endDate) {
    result += isFr ? "de " : "from ";
    result += formatDateFr(startDate) ?? startDate;
    result += isFr ? " à " : " to ";
    result += formatDateFr(endDate) ?? endDate;
  } else if (startDate && !endDate) {
    result += isFr ? "depuis " : "since ";
    result += formatDateFr(startDate) ?? startDate;
  } else if (endDate) {
    result += formatDateFr(endDate) ?? endDate;
  }

  return result;
}

/**
 * Build Typst markup for a project detail.
 */
export function buildProjectDetails(
  project: IProjectDetail,
  lang: string,
  showDates: boolean,
  listSkillsFn: (subject: NamedNode, attribute: string, lang: string) => ISkillsDetails[]
): string {
  let out = "";
  const projectName = cleanText(project.projectName?.value);

  let headerline = "";
  if (showDates) {
    const dateRange = buildDateRange(
      project.projectStartDate?.value,
      project.projectEndDate?.value,
      lang
    );
    headerline = dateRange ? `${projectName} - ${dateRange}` : projectName;
  } else {
    headerline = `- ${projectName}`;
  }

  out += `#pad(left: 4mm)[#text(size: 11pt, weight: "bold")[${escapeTypst(headerline)}]]\n\n`;

  const desc = cleanText(project.projectDescription?.value);
  if (desc) {
    desc.split('\n').forEach((lineraw: string) => {
      const line = lineraw.trim();
      if (line) {
        out += `#pad(left: 8mm)[#text(size: 10pt)[${escapeTypst(line)}]]\n\n`;
      }
    });
  }

  const skills = listSkillsFn(project.project, "schema:about", lang);
  const skillsList = skills.map(s => s.skillLabel?.value).filter(Boolean).join(', ');
  if (skillsList) {
    out += `#pad(left: 5mm)[#text(size: 10pt)[${escapeTypst(skillsList)}]]\n\n`;
  }

  return out;
}

/**
 * Build Typst markup for credential details within a role.
 */
export function buildCredentialDetails(
  role: IOrganizationRole,
  credential: ICredentialDetails,
  lang: string,
  adapters: {
    listProjects: (subject: NamedNode, attribute: string, lang: string) => IProjectDetail[];
    listSkills: (subject: NamedNode, attribute: string, lang: string) => ISkillsDetails[];
  }
): string {
  let out = "";

  const dateRange = buildDateRange(
    credential.credentialStartDate?.value,
    credential.credentialEndDate?.value,
    lang
  );
  const headerline = cleanText(credential.credentialName?.value);
  let subtitleLine = dateRange;
  if (role.employer) {
    subtitleLine += " - " + role.employer.value;
  }

  out += `=== ${escapeTypst(headerline)}\n\n`;
  if (subtitleLine) {
    out += `#text(size: 10pt, style: "italic")[${escapeTypst(subtitleLine)}]\n\n`;
  }

  const desc = cleanText(credential.credentialDescription?.value);
  if (desc) {
    out += `#pad(left: 5mm)[#text(size: 10pt)[${escapeTypst(desc)}]]\n\n`;
  }

  const projectsDetails = adapters.listProjects(credential.credential, "schema:subjectOf", lang);
  projectsDetails.forEach((project) => {
    out += buildProjectDetails(project, lang, false, adapters.listSkills);
  });

  return out;
}

/**
 * Build Typst markup for an organization role with its credentials.
 */
export function buildOrganizationRole(
  role: IOrganizationRole,
  adapters: {
    listCredentials: (subject: NamedNode, attribute: string, lang: string, variant?: NamedNode) => ICredentialDetails[];
    listProjects: (subject: NamedNode, attribute: string, lang: string) => IProjectDetail[];
    listSkills: (subject: NamedNode, attribute: string, lang: string) => ISkillsDetails[];
  },
  lang: string,
  variant?: NamedNode
): string {
  let out = "";

  if (role.description) {
    const dateRange = buildDateRange(role.startDate?.value, role.endDate?.value, lang);
    let headerline = dateRange;
    headerline += " -  " + (role.roleName?.value ?? "");
    if (role.employer) {
      headerline += " - " + role.employer.value;
    }

    out += `== ${escapeTypst(headerline)}\n\n`;

    (role.description.value + "").split('\n').forEach((lineraw: string) => {
      const line = lineraw.trim();
      if (line) {
        out += `#pad(left: 5mm)[#text(size: 10pt)[${escapeTypst(line)}]]\n\n`;
      }
    });
  }

  const skills = adapters.listSkills(role.role, "schema:skills", lang);
  const skillsList = skills.map(s => s.skillLabel?.value).filter(Boolean).join(', ');
  if (skillsList) {
    out += `#pad(left: 5mm)[#text(size: 10pt)[${escapeTypst(skillsList)}]]\n\n`;
  }

  const credentialsDetails = adapters.listCredentials(role.role, "schema:hasCredential", lang, variant);
  credentialsDetails.forEach((credential) => {
    out += buildCredentialDetails(role, credential, lang, adapters);
  });

  return out;
}

/**
 * Build Typst markup for an education entry.
 */
export function buildEducationDetails(
  education: IEducationDetails,
  lang: string,
  adapters: {
    listProjects: (subject: NamedNode, attribute: string, lang: string) => IProjectDetail[];
    listSkills: (subject: NamedNode, attribute: string, lang: string) => ISkillsDetails[];
  }
): string {
  let out = "";

  const dateRange = buildDateRange(education.educStart?.value, education.educEnd?.value, lang);
  let headerline = dateRange + " - " + (education.educLevel?.value ?? "");
  if (education.educLocationName) {
    headerline += " - " + education.educLocationName.value;
  }

  out += `=== ${escapeTypst(headerline)}\n\n`;

  const projectsDetails = adapters.listProjects(education.educ, "schema:subjectOf", lang);
  projectsDetails.forEach((project) => {
    out += buildProjectDetails(project, lang, false, adapters.listSkills);
  });

  return out;
}

/**
 * Assemble the complete Typst document from all CV data.
 */
export function buildTypstDocument(
  person: IPersonDetails,
  organizationRoles: IOrganizationRole[],
  educationList: IEducationDetails[],
  projects: IProjectDetail[],
  langList: IPersonLangDetails[],
  skills: ISkillsCount[],
  adapters: {
    listCredentials: (subject: NamedNode, attribute: string, lang: string, variant?: NamedNode) => ICredentialDetails[];
    listProjects: (subject: NamedNode, attribute: string, lang: string) => IProjectDetail[];
    listSkills: (subject: NamedNode, attribute: string, lang: string) => ISkillsDetails[];
  },
  lang: string,
  variant?: NamedNode
): string {
  const headers = getSectionHeaders(lang);
  let doc = "";

  // Preamble
  doc += buildPreamble(lang);

  // Header
  doc += buildHeader(person);

  // Experience section
  doc += `= ${headers.experience}\n\n`;
  organizationRoles.forEach((role) => {
    doc += buildOrganizationRole(role, adapters, lang, variant);
  });

  // Education section
  doc += `= ${headers.education}\n\n`;
  educationList.forEach((education) => {
    doc += buildEducationDetails(education, lang, adapters);
  });

  // Projects section
  doc += `= ${headers.projects}\n\n`;
  projects.forEach((project) => {
    doc += buildProjectDetails(project, lang, true, adapters.listSkills);
  });

  // Languages section
  doc += `= ${headers.languages}\n\n`;
  langList.forEach((personLang) => {
    const label = ` - ${personLang.lang?.value ?? ""} - ${personLang.level?.value ?? ""}`;
    doc += `#text(size: 10pt)[${escapeTypst(label)}]\n\n`;
  });

  // Skills section
  doc += `= ${headers.skills}\n\n`;
  const skillsList = skills.map((skill) => skill.skillName.value).join(', ');
  doc += `#text(size: 10pt)[${escapeTypst(skillsList)}]\n\n`;

  return doc;
}
