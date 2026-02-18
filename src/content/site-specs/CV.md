## ADR 001 - Données et stockage

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


## Abstract

- CV is stored in ttl files
- Files are loaded in oxigraph store
- store is requested using SPARQL
- Sections are displayed.


