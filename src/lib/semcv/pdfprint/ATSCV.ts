import { jsPDF } from "jspdf";
import type { NamedNode } from "oxigraph";
import type { IPersonDetails } from "../models";
import { listOrgRoles } from "../adapters/experienceAdapter";
import { skillsCounts } from "../adapters/skillsAdapter";
import { compareExperience } from "../semantic_cv_store";

export function generateATS_CV(personDetails: IPersonDetails, lang: string): jsPDF {
  const doc = new jsPDF();

  const maxWidth = 170;
  const margin = 20;
  let y = margin;
  const name: string = personDetails.name?.value as string;
  console.log("name:" + name);
  // Titre principal
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(name, margin, y);

  // Sous-titre
  y += 8;
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text(personDetails.name?.value as string, margin, y);

  // Coordonnées
  // y += 8;
  // doc.setFontSize(11);
  // doc.text("jean.dupont@email.com | 📱 +33 6 12 34 56 78 | Paris, France", margin, y);

  // Ligne de séparation
  y += 6;
  doc.setLineWidth(0.5);
  doc.line(margin, y, 210 - margin, y);

  // Section : Expériences
  y += 10;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Expérience professionnelle", margin, y);

  doc.setFontSize(12);
  let skills = skillsCounts(lang);
  let organizationRoles = listOrgRoles(personDetails?.person, "schema:hasOccupation",lang).sort(compareExperience);
  
  organizationRoles.forEach((role) => {
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text(role.roleName?.value as string, margin, y);
    y += 6;
    if (role.description) {
      (role.description?.value as string + "").split('\n').forEach((line: string) => {
        line = line.trim();
        const lines = doc.splitTextToSize(line,maxWidth);
        doc.text(lines, margin + 4, y);
        y += lines.length * 5;
  
      })
    }
  });

  // Section : Formation
  y += 5;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Formation", margin, y);

  y += 8;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Master Informatique - Université de Paris (2018 - 2020)", margin, y);

  // Section : Compétences
  y += 10;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Compétences", margin, y);

  y += 8;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("JavaScript, TypeScript, React, Node.js, SQL, Git, Docker", margin, y);
  return doc;
}