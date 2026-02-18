import type { NamedNode } from "oxigraph";
import { namedNode } from "oxigraph";
import { getPerson } from "../adapters/personAdapters";
import { listOrgRoles } from "../adapters/experienceAdapter";
import { listEducations } from "../adapters/educationAdapters";
import { listProjects } from "../adapters/projectsAdapter";
import { listPersonLangs } from "../adapters/langsAdapters";
import { listSkills, skillsCounts } from "../adapters/skillsAdapter";
import { listCredentials } from "../adapters/credentialsAdapter";
import { compareExperience } from "../semantic_cv_store";
import { browsingPreferences } from "$lib/state.svelte";
import { buildTypstDocument } from "./typstMarkup";
import { initTypstCompiler, $typst } from "./typstInit";

export async function generateATS_CV_Typst(
  personNode?: NamedNode,
  lang?: string,
  variant?: NamedNode
): Promise<Uint8Array> {
  await initTypstCompiler();

  if (!personNode) {
    personNode = namedNode("https://nka11.github.io/#me");
  }
  if (!lang) {
    lang = browsingPreferences.lang;
  }

  const personDetails = getPerson(personNode, lang, variant);
  const organizationRoles = listOrgRoles(personDetails.person, "schema:hasOccupation", lang, variant).sort(compareExperience);
  const educationList = listEducations(personDetails.person, "schema:alumniOf", lang);
  const projects = listProjects(personDetails.person, "schema:producer", lang);
  const langList = listPersonLangs(personDetails.person, lang);
  const skills = skillsCounts(lang);

  const typstMarkup = buildTypstDocument(
    personDetails,
    organizationRoles,
    educationList,
    projects,
    langList,
    skills,
    { listCredentials, listProjects, listSkills },
    lang,
    variant
  );

  const pdfBytes = await $typst.pdf({ mainContent: typstMarkup });
  if (!pdfBytes) {
    throw new Error("Typst compilation failed: no PDF output");
  }
  return pdfBytes;
}
