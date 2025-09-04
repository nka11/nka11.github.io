import { jsPDF, type TextOptionsLight } from "jspdf";
import type { ICredentialDetails, IEducationDetails, IOrganizationRole, IPersonDetails, IProjectDetail } from "../models";
import { listOrgRoles } from "../adapters/experienceAdapter";
import { listSkills, skillsCounts } from "../adapters/skillsAdapter";
import { compareExperience } from "../semantic_cv_store";
import { listCredentials } from "../adapters/credentialsAdapter";
import { extractYear, formatDateFr } from "$lib/dateFormatter";
import { listProjects } from "../adapters/projectsAdapter";
import { listEducations } from "../adapters/educationAdapters";
import { listPersonLangs } from "../adapters/langsAdapters";
import { namedNode, NamedNode } from "oxigraph";
import { getPerson } from "../adapters/personAdapters";
import { browsingPreferences } from "$lib/state.svelte";

interface DocState {
  doc: jsPDF,
  y: number,
  margin: number,
  maxWidth: number
}

export function generateATS_CV(
    personNode: NamedNode | undefined = undefined,
    lang: string | undefined = undefined,
    variant: NamedNode | undefined = undefined
  ): jsPDF {
  const doc = new jsPDF();
  if (personNode == undefined) {
    personNode = namedNode("https://nka11.github.io/#me")
  }
  if (lang == undefined) {
    lang = browsingPreferences.lang
  }
  const personDetails: IPersonDetails = getPerson(personNode,lang, variant)
  const maxWidth = 170;
  const margin = 20;
  const state={doc: doc, y: margin, margin:margin, maxWidth: maxWidth};
  const name: string = personDetails.name?.value as string;
  console.log("name:" + name);
  // Titre principal
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(name, margin,state.y);

  // Sous-titre
  state.y +=  8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.textWithLink('https://nk11.github.io/cv', margin, state.y, { url: 'https://nk111.github.io/cv' });
  // classified contact informations will come here
  state.y += 1.7;
  // writeBlock(state,personDetails.name?.value as string,0,7)
  doc.setLineWidth(0.5);
  doc.line(margin-10,state.y, 210 - margin +10,state.y);
  state.y +=  6;
  // state.y +=  8;
  doc.setFontSize(16);
  writeBlock(state,personDetails.jobTitle?.value as string,0,6)
  // doc.setLineWidth(0.2);
  // doc.line(margin,state.y, 210 - margin,state.y);
  state.y +=  4;
  // doc.text(, margin,state.y);

  // Coordonnées
  // state.y +=  8;
  doc.setFontSize(11);
  writeBlock(state,personDetails.description?.value as string,0,5)
  // doc.text("jean.dupont@email.com | 📱 +33 6 12 34 56 78 | Paris, France", margin,state.y);

  // Ligne de séparation
  // state.y +=  6;
  doc.setLineWidth(0.5);
  // doc.line(margin,state.y, 210 - margin,state.y);
  doc.line(margin-10,state.y, 210 - margin +10,state.y);

  // state.y +=  3;

  // Section : Expériences
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  // doc.setLineWidth(0.2);
  // doc.line(margin,state.y, 210 - margin,state.y);
  state.y +=  6;

  doc.text("Expérience professionnelle", margin,state.y);
  state.y +=  8;
  let skills = skillsCounts(lang);
  let organizationRoles = listOrgRoles(personDetails?.person, "schema:hasOccupation",lang, variant).sort(compareExperience);
  let educationList = listEducations(personDetails.person,"schema:alumniOf",lang);
  let langList = listPersonLangs(personDetails.person, lang);
  organizationRoles.forEach((role) => {
    printOrganizationRole(role, state, lang, variant);
  });

  // Section : Formation
  doc.setLineWidth(0.5);
  doc.line(margin-10,state.y, 210 - margin +10,state.y);

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  state.y +=  6;

  doc.text("Formation", margin,state.y);
  state.y +=  8;
  educationList.forEach((education) => {
    printEducationDetails(state,education,lang);
  })
  // Section : Projets

  doc.setLineWidth(0.5);
  doc.line(margin-10,state.y, 210 - margin +10,state.y);

  // state.y +=  10;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  state.y +=  6;
  doc.text("Projets", margin,state.y);
  state.y +=  8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const projects = listProjects(personDetails.person, "schema:producer",lang);
  // // projectsDetails = listProjects
  projects.forEach((project) => {
    printProjectDetails(state,project, lang,true);
  });

  // Section : Langues
  state.y +=  10;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setLineWidth(0.5);
  doc.line(margin-10,state.y, 210 - margin +10,state.y);
state.y +=  6;
  doc.text("Langues", margin,state.y);
  state.y +=  8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  langList.forEach((personLang) => {
    const langlabel = ` - ${personLang.lang?.value} - ${personLang.level?.value}`;
    writeBlock(state,langlabel,0,5);
  })

  // Section : Compétences
  state.y +=  10;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setLineWidth(0.5);
  doc.line(margin-10,state.y, 210 - margin +10,state.y);
  state.y +=  6;
  doc.text("Compétences", margin,state.y);
  state.y +=  8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  let skillsList = skills.map((skill) => skill.skillName.value).join(', ');
  writeBlock(state,skillsList,0,5);
  return doc;
}


function writeBlock(state:DocState, text: string, blockMargin: number, lineHeight: number): void {
  text.split('\n').forEach((lineraw) => {
    const line = lineraw.trim(); // other stuff if nevessary
    if (line === undefined || line === "undefined" || line == "") return;
    const pageHeight = state.doc.internal.pageSize.getHeight();
    const blockOpts:TextOptionsLight = {
      maxWidth: state.maxWidth - blockMargin,
      align: "justify"
    }
    const lines = state.doc.splitTextToSize(line, state.maxWidth - blockMargin);
    const blockHeight = lines.length * lineHeight;
    if (state.y + blockHeight > pageHeight - state.margin) {
      state.doc.addPage();
      state.y = state.margin;
    }
  
    state.doc.text(lines, state.margin + blockMargin, state.y, blockOpts);
    state.y += blockHeight;
  })
}


function printProjectDetails(state:DocState, project:IProjectDetail, lang: string, showDates=false) {
  let headerline = "";
  if (showDates) {
    if (project.projectStartDate || project.projectEndDate) {
      if (project.projectStartDate && project.projectEndDate) {
        headerline += "de ";
      }
      if (project.projectStartDate && !project.projectEndDate) {
        headerline += "depuis ";
      }
      if (project.projectStartDate) {
        headerline += formatDateFr(project.projectStartDate.value);
      }
      if (project.projectStartDate && project.projectEndDate) {
        headerline += " à ";
      }
      if (project.projectEndDate) {
        headerline += formatDateFr(project.projectEndDate.value);
      }
    }
    headerline = `${project.projectName?.value} - ${headerline}`;
  } else {

    headerline += `- ${project.projectName?.value}`;
  }

  // state.y +=  2;
  state.doc.setFontSize(11);
  state.doc.setFont("helvetica", "bold");
  
  writeBlock(state,headerline,4,5);
  
  (project.projectDescription?.value as string + "").split('\n').forEach((line: string) => {
          
          line = line.trim();
          if (line == "") return;
          
          state.doc.setFont("helvetica", "normal");
          state.doc.setFontSize(10);
          writeBlock(state,line,8,4);
        })
        const skills = listSkills(
      project.project,
      "schema:about",
      lang ?? browsingPreferences.lang
    )
    writeBlock(state, skills.map(skill => skill.skillLabel?.value).join(', '), 5, 5);
}

function printRoleCredentialDetails(state:DocState, role:IOrganizationRole, credential:ICredentialDetails, lang: string) {
  let subtitleLine = "";
  if (credential.credentialStartDate || credential.credentialEndDate) {
    if (credential.credentialStartDate && credential.credentialEndDate) {
      subtitleLine += "de ";
    }
    if (credential.credentialStartDate && !credential.credentialEndDate) {
      subtitleLine += "depuis ";
    }
    if (credential.credentialStartDate) {
      subtitleLine += formatDateFr(credential.credentialStartDate.value);
    }
    if (credential.credentialStartDate && credential.credentialEndDate) {
      subtitleLine += " à ";
    }
    if (credential.credentialEndDate) {
      subtitleLine += formatDateFr(credential.credentialEndDate.value);
    }
  }
  let headerline = "" + credential.credentialName?.value;
  if (role.employer) {
    subtitleLine += " - " + role.employer?.value;
  }

  state.y +=  1.6;
  state.doc.setLineWidth(0.1);
  state.doc.line(state.margin,state.y, 210 - state.margin * 2 , state.y);
  state.y +=  3.8;
  state.doc.setFontSize(12);
  state.doc.setFont("helvetica", "bold");
  writeBlock(state,headerline,0,6)
  state.y -=  2.5;
  state.doc.setFontSize(10);
  state.doc.setFont("helvetica", "normal");
  state.doc.setFont("helvetica", "italic");
  writeBlock(state,subtitleLine,0,6)
  // state.doc.text(headerline, state.margin, state.y);
  state.doc.setFont("helvetica", "normal");

  state.doc.setFontSize(10);
  state.doc.setFont("helvetica", "normal");
  writeBlock(state, "" + credential.credentialDescription?.value as string, 5, 5);
  // (credential.credentialDescription?.value as string + "").split('\n').forEach((line: string) => {
  //   line = line.trim();
  //   if (line !== "")
  // });

  state.doc.setFontSize(10);
  const projectsDetails = listProjects(credential.credential, "schema:subjectOf", lang);
  projectsDetails.forEach((project) => {
    printProjectDetails(state,project, lang);
  });
}

function printEducationDetails(state:DocState, education: IEducationDetails, lang:string) {
  let headerline = "";
  if (education.educStart || education.educEnd) {
    if (education.educStart && education.educEnd) {
      headerline += "de ";
    }
    if (education.educStart && !education.educEnd) {
      headerline += "depuis ";
    }
    if (education.educStart) {
      headerline += formatDateFr(education.educStart.value);
    }
    if (education.educStart && education.educEnd) {
      headerline += " à ";
    }
    if (education.educEnd) {
      headerline += formatDateFr(education.educEnd.value);
    }
  }
  headerline += " - " + education.educLevel?.value;
  if (education.educLocationName) {
    headerline += " - " + education.educLocationName?.value;
  }
  state.y +=  0.6;
  state.doc.setLineWidth(0.1);
  state.doc.line(state.margin,state.y, 210 - state.margin * 2 , state.y);
  state.y +=  3.4;
  state.doc.setFontSize(12);
  state.doc.setFont("helvetica", "bold");
  writeBlock(state,headerline,0,6)
  // state.doc.text(headerline, state.margin, state.y);
  state.doc.setFont("helvetica", "normal");
  state.doc.setFontSize(10);
  const projectsDetails = listProjects(education.educ, "schema:subjectOf", lang);
  projectsDetails.forEach((project) => {
    printProjectDetails(state,project, lang);
  });
}


function printOrganizationRole(role: IOrganizationRole, state: { doc: jsPDF; y: number; margin: number; maxWidth: number; }, lang: string, variant?: NamedNode) {
  let headerline = "";
  if (role.description) {
      

    if (role.startDate || role.endDate) {
      if (role.startDate && role.endDate) {
        headerline += "de ";
      }
      if (role.startDate && !role.endDate) {
        headerline += "depuis ";
      }
      if (role.startDate) {
        headerline += formatDateFr(role.startDate.value);
      }
      if (role.startDate && role.endDate) {
        headerline += " à ";
      }
      if (role.endDate) {
        headerline += formatDateFr(role.endDate.value);;
      }
    }

    headerline += " -  " + (role.roleName?.value ? role.roleName?.value : "");
    if (role.employer) {
      headerline += " - " + role.employer?.value;
    }
  
    // writeBlock(state, headerline, 0, 6);
    
    
    // doc.text(headerline, margin,state.y);  
    state.y +=  0.6;
    // state.doc.setLineWidth(0.1);
    // state.doc.line(state.margin,state.y, 210 - state.margin , state.y);
    // state.y +=  3.8;
    state.doc.setFont("helvetica", "bold");
    state.doc.setFontSize(12);
    writeBlock(state, headerline, 0, 6);
    state.doc.setFontSize(10);
    state.doc.setFont("helvetica", "normal");
    (role.description?.value as string + "").split('\n').forEach((line: string) => {
      
      line = line.trim();
      if (line !== "")
        writeBlock(state, line, 5, 5);
    });
  }
  const skills = listSkills(
      role.role,
      "schema:skills",
      lang ?? browsingPreferences.lang
    )
    writeBlock(state, skills.map(skill => skill.skillLabel?.value).join(', '), 5, 5);
  const credentialsDetails = listCredentials(role.role, "schema:hasCredential", lang, variant);
  credentialsDetails.forEach((credential) => {
    printRoleCredentialDetails(state, role, credential, lang);
  });
}
