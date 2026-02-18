const headers: Record<string, Record<string, string>> = {
  fr: {
    experience: "Expérience professionnelle",
    education: "Formation",
    projects: "Projets",
    languages: "Langues",
    skills: "Compétences"
  },
  en: {
    experience: "Professional Experience",
    education: "Education",
    projects: "Projects",
    languages: "Languages",
    skills: "Skills"
  }
};

export function getSectionHeaders(lang: string): Record<string, string> {
  return headers[lang] ?? headers["en"];
}
