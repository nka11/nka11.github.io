---
title: "Choisir une ontologie pour présenter un CV sémantique"
date: "2025-07-06"
description: "Comparatif des ontologies RDF pour modéliser un CV"
slug: "2025-07-06-cv-ontology"
---

# Comparatif des ontologies RDF pour modéliser un CV : ResumeRDF, Europass, DOAC et autres

## 🧭 Introduction

Modéliser un **CV en RDF** permet de structurer les informations professionnelles d'une personne de façon interopérable, exploitable par des moteurs sémantiques, des triplestores ou des plateformes d'analyse de profils.

Plusieurs **ontologies RDF** ont été proposées pour cette tâche. Cet article compare les principales : **ResumeRDF**, **Europass**, **DOAC**, **FOAF** et **Schema.org**, en détaillant leurs usages, avantages et limites.

---

## 🧱 Ontologies comparées

| Ontologie     | Spécialisée CV | Norme officielle | Multilingue | Granularité | Popularité |
|---------------|----------------|------------------|-------------|-------------|------------|
| **ResumeRDF** | ✅ Oui          | ❌ Non            | ❌ Non       | Élevée      | Faible     |
| **Europass**  | ✅ Oui          | ✅ UE             | ✅ Oui       | Très élevée | Moyenne    |
| **DOAC**      | ✅ Oui          | ❌ Non            | ❌ Non       | Moyenne     | Moyenne    |
| **FOAF**      | ❌ Non         | ❌ Non            | ❌ Non       | Faible      | Élevée     |
| **Schema.org**| ❌ Non         | ✅ (dé facto)     | Partiel     | Variable    | Très élevée|

---

## 🎓 1. Europass RDF

**Europass** est une ontologie officielle développée par l'Union Européenne pour structurer des CV, des lettres de motivation et des diplômes. Elle s'intègre parfaitement avec le vocabulaire **ESCO**, qui décrit les compétences et professions en plusieurs langues.

- **URI** : `https://data.europa.eu/europass/ontology/`
- **Points forts** :
  - Norme européenne officielle
  - Multilingue
  - Interopérable avec d'autres plateformes (job boards, ESCO, EURES)
- **Exemples de classes** : `europass:WorkExperience`, `europass:Skill`, `europass:Qualification`, `europass:Portfolio`

---

## 🧪 2. ResumeRDF

**ResumeRDF** est une ontologie communautaire dédiée à la représentation complète d’un CV en RDF.

- **URI** : (non officiel, souvent : `http://resume.example.org/`)
- **Points forts** :
  - Facile à comprendreEuropass RDF Ontology
  - Proche des structures classiques de CV
- **Limites** :
  - Peu documentée
  - Pas de norme officielle
  - Pas multilingue

- **Exemples de classes** : `resume:Person`, `resume:WorkExperience`, `resume:Education`, `resume:Skill`

---

## 📄 3. DOAC (Description of a Career)

**DOAC** est une ontologie simple, conçue pour décrire une carrière professionnelle en RDF. Moins riche qu'Europass, mais facile à utiliser pour des cas légers.

- **URI** : `http://ramonantonio.net/doac/`
- **Exemples** :
  - `doac:Experience`, `doac:hasSkill`, `doac:Education`
- **Utilisation typique** :
  - Petits triplestores RDF personnels
  - Prototypes ou CV en ligne simples

---

## 👤 4. FOAF

**FOAF (Friend of a Friend)** est une ontologie généraliste pour décrire des personnes sur le Web sémantique. Elle n'est **pas spécifique au CV**, mais utile pour l’identité numérique de base.

- **URI** : `http://xmlns.com/foaf/0.1/`
- **Classes pertinentes** :
  - `foaf:Person`, `foaf:name`, `foaf:mbox`, `foaf:homepage`

**👉 FOAF est souvent combiné avec DOAC ou Europass** pour enrichir la sémantique.

---

## 🌐 5. Schema.org

**Schema.org** est une initiative soutenue par Google, Microsoft, Yahoo et Yandex. Elle permet d’annoter sémantiquement des pages web avec du contenu structuré pour améliorer le SEO (rich snippets).

- **Classes pertinentes pour un CV** :
  - `Person`
  - `JobPosting`
  - `EducationalOccupationalCredential`
  - `skills`
- **Avantages** :
  - Indexation SEO
  - JSON-LD supporté
- **Limites** :
  - Pas conçu spécifiquement pour des bases RDF / triplestores
  - Pas de vocabulaire complet pour l'expérience détaillée

---

## 🏁 Quel vocabulaire choisir ?

| Besoin                                                    | Ontologie recommandée         |
|------------------------------------------------------------|-------------------------------|
| CV interopérable au niveau européen                        | ✅ Europass                   |
| CV RDF simple et rapide à implémenter                      | ✅ DOAC                       |
| Identité numérique RDF de base                             | ✅ FOAF                       |
| Publication sur un site web SEO                            | ✅ Schema.org (JSON-LD)       |
| Base RDF personnelle avec toutes les infos d’un CV         | ✅ ResumeRDF (ou Europass)    |

---

## 🧪 Exemple minimal en Turtle (Europass + FOAF)

```turtle
@prefix foaf:  <http://xmlns.com/foaf/0.1/> .
@prefix europass: <https://data.europa.eu/europass/ontology/> .

<#me> a foaf:Person, europass:Person ;
    foaf:name "Nicolas Karageuzian" ;
    europass:fullName "Nicolas Karageuzian" ;
    europass:preferredLabel "Senior Security Architect" ;
    europass:hasSkill "Javascript", "DevOps", "SPARQL" .
```

## Conclusion

Chaque vocabulaire RDF pour CV a ses points forts. Si tu veux viser interopérabilité, alignement européen et exhaustivité, Europass est le meilleur choix. Pour des besoins plus simples ou personnels, DOAC et ResumeRDF peuvent suffire.

N’hésite pas à combiner plusieurs vocabulaires (FOAF + DOAC + Europass) pour un rendu complet.

## 📚 Ressources

 - [Europass RDF Ontology](https://data.europa.eu/europass/ontology/)
 - [ESCO – European Skills, Competences, Qualifications and Occupations](https://esco.ec.europa.eu/)
 - [FOAF Vocabulary](http://xmlns.com/foaf/spec/)
 - [Schema.org](https://schema.org/)
 - [DOAC Ontology (archivé)](http://ramonantonio.net/doac/)