---
title: Design de CV en 2025 pour les ATS
description: "Comment écrire un CV pour passer les ATS ?"
slug: 2025-cv-design-ats
date: "2025-09-12"
tags:
  - emploi
---

# Comment mettre en page son CV en 2025

Aujourd’hui, de nombreuses entreprises utilisent des ATS (Applicant Tracking Systems) pour trier automatiquement les CV avant qu’ils n’arrivent entre les mains d’un recruteur. Si votre CV n’est pas correctement formaté pour ces logiciels, il risque d’être rejeté, même si vous êtes parfaitement qualifié.

Je demande donc à mon fidèle ami félin ballonné comment faire pour "passer" cette barrière, et partant des conseils qu'il me donne (discussion initiale en dessous), je démarre mon "projet CV" avec le scénario utilisateur suivant :

> En tant que candidat, je veux pouvoir disposer des données typées de mon CV pour les représenter sous différents formats, ce qui me permettra notamment de générer un CV compatible avec les ATS.

## ADR #01 - Données et stockage

J'ai déja un MVP : plusieurs versions du CV, en PDF, sur canvas... J'ai de la DATA mais elle n'est pas structurée.

Fondamental et structurant, c'est le pilier d'une nouvelle stack : Ce sont des choix d'architecture technique qui vont être très difficile à challenger après sans devoir revoir l'ensemble du projet.

Des parties de cette section sont extraites du résultat d'un prompt qui demande conseil sur comment stocker les données du CV dans un format DATA compréhensible par l'IA :

Formats conseillés :

 1. JSON-LD (Linked Data)
   - Format JSON lisible par l’IA et compatible avec le Web sémantique.
   - Utilise des ontologies standardisées (par ex. Schema.org
 2. RDF / Turtle / OWL
   - Pour un usage avancé (bases de graphes, ontologies).
   - Permet la recherche SPARQL, l’inférence et les liens entre compétences, expériences, métiers.
 3. JSON classique structuré
   - Suffisant si on reste dans un contexte interne (par exemple un moteur de recommandation RH).
   - On y ajoute un schéma validé (ex. avec JSON Schema).

Mon appétence pour la sémantique me pousse naturellement sur le choix 2.

Dans ses conseils et bonnes pratiques, notre eloquent compagnon positronique nous propose de :

 1. Standardiser les compétences : utiliser ESCO (European Skills/Competences) ou O*NET pour éviter les doublons/variantes (“Python 3” vs “Python”).
 2. Versionner les CV → garder l’évolution des compétences et expériences.
 3. Stockage :
   - Base JSON / NoSQL (MongoDB, ElasticSearch) pour recherche rapide.
   - Graphe RDF (ex. Neo4j, GraphDB, Oxigraph) pour exploration sémantique.
 4. Indexation vectorielle : transformer textes (expériences, compétences) en embeddings (OpenAI, HuggingFace, etc.) pour faire du matching IA.

l'ajout de la contrainte 2 des bonnes pratiques précise mon choix pour le format de représentation, je trouve les diff de Turtle plus digestes que ceux des autres format pour peu qu'on le structure proprement, ce qui me permet de versionner avec git.
Pour le 3, je choisis oxigraph pour sa perf et sa portabilité : je peux, dans le browser (donc sur mobile/desktop), charger les ttl dans le store, faire du SPARQL, générer un pdf avec jsPDF, faire un rendu dynamique des DATA avec vuejs, et je pourrai plus tard tenter de faire des dataviz en profitant de l’inférence et des liens entre compétences, expériences, métiers... (mais pourquoi ? 💡🌀🤪).

# Discussion initiale à propos du CV ATS

Tout le contenu ci-dessous est résultat d'un prompt qui demande comment rédiger un CV compatible ATS.

## 🔍 Qu’est-ce qu’un ATS ?

Un **ATS** est un logiciel de gestion des candidatures. Il scanne les CV reçus pour :

- extraire les informations clés (nom, compétences, expérience, etc.)
- classer les candidats en fonction de mots-clés
- filtrer les candidatures selon les critères définis par le recruteur

Un CV mal structuré ou trop graphique peut rendre l’extraction des données difficile, voire impossible.

## ✅ Les règles de base à respecter

### 1. Utiliser un format de fichier compatible

- **Préférez le format `.docx` ou `.pdf` simple** (évitez les PDF complexes issus d’InDesign ou Canva)
- Évitez les formats d’image (.jpg, .png) ou les PDF scannés

### 2. Rester sobre sur le design

- Bannissez les colonnes multiples (sauf si très bien structurées)
- Évitez les tableaux imbriqués, zones de texte ou formes graphiques
- Utilisez une **mise en page linéaire**, de haut en bas

### 3. Hiérarchiser avec des titres clairs

Utilisez des en-têtes simples comme :

- **Profil**
- **Expérience professionnelle**
- **Formation**
- **Compétences**
- **Langues**
- **Certifications**

Les ATS reconnaissent les sections standards en anglais comme en français.

### 4. Utiliser des polices classiques

- Arial, Calibri, Times New Roman, Helvetica
- Taille : 10 à 12 pts
- Pas de polices décoratives ou manuscrites

### 5. Insérer les mots-clés du poste

- Analysez l’offre d’emploi
- Reprenez les **mots-clés exacts** (compétences, outils, diplômes)
- Répartissez-les naturellement dans le texte (titre, compétences, expériences)

---

## 📌 Structure recommandée pour un CV lisible par les ATS

- Prénom NOM  
- Adresse email | Numéro de téléphone | LinkedIn (facultatif)

**Titre du CV** (ex : Développeur Web Full Stack – React / Node.js)

### PROFIL  
Résumé de 3-4 lignes présentant votre expérience, vos compétences clés et votre objectif professionnel.

### EXPÉRIENCE PROFESSIONNELLE  
**Intitulé du poste – Nom de l’entreprise – Ville – Dates**  
- Tâches et responsabilités  
- Résultats ou réalisations chiffrées  

### FORMATION  
**Nom de l’établissement – Diplôme – Dates**

### COMPÉTENCES  
- Compétence 1  
- Compétence 2  
- Outil / logiciel  

### LANGUES  
- Français : langue maternelle  
- Anglais : courant (TOEIC 850)

### CERTIFICATIONS (si applicable)

---

## ❌ À éviter absolument

- Les logos, icônes, images, emojis
- Les colonnes décoratives ou infographies
- Les fichiers protégés par mot de passe
- Les liens sans texte explicite (ex : "cliquez ici")
- Les phrases génériques trop longues ou floues

---

## 🛠 Astuce bonus : tester son CV

Avant de postuler, testez votre CV sur des simulateurs ATS gratuits :

- [Jobscan](https://www.jobscan.co/)
- [Resumeworded](https://resumeworded.com/)

Ils analysent si votre CV est lisible par les logiciels et vous donnent des conseils d’optimisation.

---

## 🎯 Conclusion

Un bon CV ATS-friendly ne doit pas chercher à impressionner visuellement, mais à **être lisible par une machine**. Simplicité, clarté et mots-clés pertinents sont vos meilleurs alliés pour franchir cette première barrière et atteindre un recruteur humain.
