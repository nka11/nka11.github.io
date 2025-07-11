import { jsPDF } from "jspdf";
import type { NamedNode } from "oxigraph";
import type { ICredentialDetails, IOrganizationRole, IPersonDetails, IProjectDetail } from "../models";
import { listOrgRoles } from "../adapters/experienceAdapter";
import { skillsCounts } from "../adapters/skillsAdapter";
import { compareExperience } from "../semantic_cv_store";
import { listCredentials } from "../adapters/credentialsAdapter";
import { extractYear, formatDateFr } from "$lib/dateFormatter";
import { listProjects } from "../adapters/projectsAdapter";

interface DocState {
  doc: jsPDF,
  y: number,
  margin: number,
  maxWidth: number
}

function writeBlock(state:DocState, text: string, blockMargin: number, lineHeight: number): void {
  const pageHeight = state.doc.internal.pageSize.getHeight();
  const lines = state.doc.splitTextToSize(text, state.maxWidth);
  const blockHeight = lines.length * lineHeight;

  if (state.y + blockHeight > pageHeight - state.margin) {
    state.doc.addPage();
    state.y = state.margin;
  }

  state.doc.text(lines, state.margin + blockMargin, state.y);
  state.y += blockHeight;
}


function printProjectDetails(state:DocState, project:IProjectDetail, lang: string) {
  let headerline = "";
  // if (project.projectStartDate || project.projectEndDate) {
  //   if (project.projectStartDate && project.projectEndDate) {
  //     headerline += "de ";
  //   }
  //   if (project.projectStartDate && !project.projectEndDate) {
  //     headerline += "depuis ";
  //   }
  //   if (project.projectStartDate) {
  //     headerline += formatDateFr(project.projectStartDate.value);
  //   }
  //   if (project.projectStartDate && project.projectEndDate) {
  //     headerline += " à ";
  //   }
  //   if (project.projectEndDate) {
  //     headerline += formatDateFr(project.projectEndDate.value);
  //   }
  // }
  headerline += "- " + project.projectName?.value;

  // state.y +=  2;
  state.doc.setFontSize(11);
  state.doc.setFont("helvetica", "bold");
  
  writeBlock(state,headerline,4,5)
  state.doc.setFont("helvetica", "normal");
  state.doc.setFontSize(10);
  
  
  (project.projectDescription?.value as string + "").split('\n').forEach((line: string) => {
          
          line = line.trim();
          if (line == "") return;
          writeBlock(state,line,8,4);
          // const lines = state.doc.splitTextToSize(line,state.maxWidth);
          // // console.log(lines);
          // state.doc.text(lines, state.margin + 4,state.y);
          // state.y +=  (lines.length) * 4;
        })
}

function printRoleCredentialDetails(state:DocState, role:IOrganizationRole, credential:ICredentialDetails, lang: string) {
  let headerline = "";
  if (credential.credentialStartDate || credential.credentialEndDate) {
    if (credential.credentialStartDate && credential.credentialEndDate) {
      headerline += "de ";
    }
    if (credential.credentialStartDate && !credential.credentialEndDate) {
      headerline += "depuis ";
    }
    if (credential.credentialStartDate) {
      headerline += formatDateFr(credential.credentialStartDate.value);
    }
    if (credential.credentialStartDate && credential.credentialEndDate) {
      headerline += " à ";
    }
    if (credential.credentialEndDate) {
      headerline += formatDateFr(credential.credentialEndDate.value);
    }
  }
  headerline += " - " + credential.credentialName?.value;
  if (role.employer) {
    headerline += " - " + role.employer?.value;
  }
  state.y +=  3;
  state.doc.setFontSize(12);
  state.doc.setFont("helvetica", "bold");
  writeBlock(state,headerline,0,6)
  // state.doc.text(headerline, state.margin, state.y);
  state.doc.setFont("helvetica", "normal");
  state.doc.setFontSize(10);
  const projectsDetails = listProjects(credential.credential, "schema:subjectOf", lang);
  projectsDetails.forEach((project) => {
    printProjectDetails(state,project, lang);
  });
}

export function generateATS_CV(personDetails: IPersonDetails, lang: string): jsPDF {
  const doc = new jsPDF();

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
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
    writeBlock(state,personDetails.name?.value as string,0,7)

  
  // doc.text(, margin,state.y);

  // Coordonnées
  // state.y +=  8;
  // doc.setFontSize(11);
  // doc.text("jean.dupont@email.com | 📱 +33 6 12 34 56 78 | Paris, France", margin,state.y);

  // Ligne de séparation
  // state.y +=  6;
  doc.setLineWidth(0.5);
  doc.line(margin,state.y, 210 - margin,state.y);

  // Section : Expériences
  state.y +=  10;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Expérience professionnelle", margin,state.y);
  state.y +=  8;
  
 
  let skills = skillsCounts(lang);
  let organizationRoles = listOrgRoles(personDetails?.person, "schema:hasOccupation",lang).sort(compareExperience);
  
  organizationRoles.forEach((role) => {
   
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

       headerline += " -  " + (role.roleName?.value ? role.roleName?.value : "") ;
        if (role.employer) {
          headerline += " - " + role.employer?.value
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        writeBlock(state,headerline,0,6)
        
        // doc.text(headerline, margin,state.y);  
        
        doc.setFont("helvetica", "normal");
        (role.description?.value as string + "").split('\n').forEach((line: string) => {
          
          // state.y +=  6;
          line = line.trim();
          writeBlock(state,line,5,5)
          // const lines = doc.splitTextToSize(line,maxWidth);
          // doc.text(lines, margin + 4,state.y);
          // state.y +=  (lines.length -1) * 5;
          
        })
    }
    const credentialsDetails = listCredentials(role.role, "schema:hasCredential", lang);
    credentialsDetails.forEach((credential) => {
      printRoleCredentialDetails(state, role, credential, lang);
    })
  });

  // Section : Formation
  state.y +=  5;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Formation", margin,state.y);

  state.y +=  8;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Master Informatique - Université de Paris (2018 - 2020)", margin,state.y);

  // Section : Compétences
  state.y +=  10;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Compétences", margin,state.y);

  state.y +=  8;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("JavaScript, TypeScript, React, Node.js, SQL, Git, Docker", margin,state.y);
  return doc;
}