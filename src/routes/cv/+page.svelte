<script lang="ts">
  import { onMount } from 'svelte';
  import OrganizationRole from '$lib/components/schemaorgcv/Experience.svelte';
  import { mapToObject, oxigraphStore, initOxigraph } from '$lib/stores/semantic_cv_store';
  import { get } from 'svelte/store';
  import type { IOrganizationRole } from '$lib/models/schemaorgcv';
    import type { Term } from 'oxigraph';
  let mainResult: Array<any> = [];
  let organizationRoles: IOrganizationRole[] = [];
  let error = '';
  let loading = true;
  // https://europa.eu/europass/elm-browser/documentation/rdf/ontology/documentation/elm.html#/

  
  // tool to compare experience dates to sort
  function compareExperience(exp1: IOrganizationRole, exp2: IOrganizationRole) {
    if (!exp1.endDate && !exp2.endDate) {
      if ((exp1.startDate?.value ?? '') < (exp2.startDate?.value ?? ''))  return  -1
      return 1;
    }
    if (!exp1.endDate && exp2.endDate) {
      return -1;
    }
    if (exp1.endDate && !exp2.endDate) {
      return 1;
    }
    if ((exp1.endDate?.value ?? '') < (exp2.endDate?.value ?? '')) {
      return 1;
    }
    return -1;
  }
  onMount(async () => {
    try {
      await initOxigraph(); // Exécuté uniquement côté navigateur
      const { store, oxiReady } = get(oxigraphStore);
      if (!oxiReady) {
          console.log("CV layout onMount: semantic store not ready");
          return;
        }
      //const store = instance;

      // await init(wasmUrl);; // charge le module WebAssembly

      //const store = new Store();

      // Charger le fichier .ttl (ex: CV)
      // const turtleText = await fetch(turtleUrl).then((res) => res.text());

      // Charger les triples dans le store RDF
      // store.load(turtleText, 'text/turtle');

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
        SELECT ?person ?roleName ?employer ?startDate ?endDate ?description ?identifier
        WHERE {
          ?person a schema:Person .

          OPTIONAL {
            ?person schema:hasOccupation ?exp .
            ?exp schema:roleName ?roleName ;
                schema:identifier ?identifier ;
                schema:startDate ?startDate ;
                
                schema:withinOrganization ?org .
            FILTER(LANG(?roleName) = "fr" || LANG(?roleName) = "")
            ?org schema:name ?employer .
            OPTIONAL {
              ?exp schema:endDate ?endDate .
            }
            OPTIONAL {
              ?exp schema:description ?description .
              FILTER(LANG(?description) = "fr" || LANG(?description) = "")
            }
          }
        }
        ORDER BY DESC(?endDate)
      `
        // OPTIONAL { ?person europass:hasLanguageSkill ?lang . }
      const mainResults = store?.query(EntityQuery) as unknown as Map<string, Term>[];
      const experiencesRaw = store?.query(ExperiencesQuery) as unknown as Map<string, Term>[];
      //console.log(experiencesRaw);
      mainResult = mainResults.map(mapToObject);
      
      organizationRoles = (experiencesRaw.map(mapToObject) as IOrganizationRole[]).sort(compareExperience);
      
    } catch (e) {
      console.error(e);
      error = 'Erreur lors de l’exécution du module WASM ou du parsing RDF.';
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <p>Chargement du CV</p>
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
      <h2 class="text-3xl">Expérience Professionnelle</h2>
      <section 
        class="px-2"
        >
        
        {#each organizationRoles as orgrole}
          <OrganizationRole organizationRole={orgrole}/>
        {/each}
      </section>
      <h2 class="text-3xl">Compétences</h2>
      <section>

      </section>
      <h2>Formation</h2>
      <section>

      </section>
      <h2>Langues</h2>
      <section>

      </section>
      <h2>Projets Personnels</h2>
      <section>

      </section>
  </article>
{/if}
