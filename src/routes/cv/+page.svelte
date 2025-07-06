<script lang="ts">
  import { onMount } from 'svelte';
  import init, { Store } from 'oxigraph';
  import wasmUrl from 'oxigraph/web_bg.wasm?url';
  import WorkExperience from './WorkExperience.svelte';
  let mainResult: any = null;
  let experiences: any = null;
  let error = '';
  let loading = true;
  // https://europa.eu/europass/elm-browser/documentation/rdf/ontology/documentation/elm.html#/
  const turtleUrl = '/cv_schemaorg.ttl';

    function mapToObject(map: Map<string, any>): Record<string, any> {
    const obj: Record<string, any> = {};
    for (const [key, value] of map.entries()) {
        obj[key] = value;
    }
    return obj;
    }

  onMount(async () => {
    try {
      await init(wasmUrl);; // charge le module WebAssembly

      const store = new Store();

      // Charger le fichier .ttl (ex: CV)
      const turtleText = await fetch(turtleUrl).then((res) => res.text());

      // Charger les triples dans le store RDF
      store.load(turtleText, 'text/turtle');

      // SPARQL query dans le navigateur
      const EntityQuery = `
        PREFIX schema: <https://schema.org/>

SELECT ?fullName ?title
WHERE {
  ?person a schema:Person ;
          schema:name ?fullName ;
          schema:jobTitle ?title .
}
      `;
      const ExperiencesQuery = `
      PREFIX schema: <https://schema.org/>

SELECT ?person ?jobTitle ?employer ?startDate ?endDate ?description
WHERE {
  ?person a schema:Person .

  OPTIONAL {
    ?person schema:hasOccupation ?exp .
    ?exp schema:roleName ?jobTitle ;
         schema:startDate ?startDate ;
         schema:endDate ?endDate ;
         schema:memberOf ?org .

    ?org schema:name ?employer .

    OPTIONAL {
      ?exp schema:description ?description .
    }
  }
}
ORDER BY DESC(?endDate)
`
        // OPTIONAL { ?person europass:hasLanguageSkill ?lang . }
      const mainResults = store.query(EntityQuery);
      const experiencesRaw = store.query(ExperiencesQuery);
      console.log(experiencesRaw);
      if (Array.isArray(mainResults)) {
        mainResult = mainResults.map(mapToObject);
        experiences = experiencesRaw.map(mapToObject);
      } else {
        error = 'La requête SPARQL ne retourne pas un objet du type attendu.';
      }
    } catch (e) {
      console.error(e);
      error = 'Erreur lors de l’exécution du module WASM ou du parsing RDF.';
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <p>Chargement du CV RDF dans Oxigraph…</p>
{:else if error}
  <p style="color: red;">{error}</p>
{:else if mainResult}
  <article vocab="https://data.europa.eu/europass/ontology/" 
    prefix="
      schema: https://schema.org/
    "
  typeof="schema:Person">
    {#each mainResult as row}
        <h2 property="schema:name">{row.fullName?.value}</h2>
        <p><strong property="schema:jobTitle">{row.title?.value}</strong></p>
        {#if row.lang}
            <p>Langue : {row.lang?.value}</p>
        {/if}
    {/each}
    {#each experiences as experience}
        <WorkExperience workExperience={experience}/>
        
    {/each}
  </article>
{/if}
