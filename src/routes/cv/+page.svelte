<script lang="ts">
  import { locale, _ } from 'svelte-i18n';
  
  import { onMount } from 'svelte';
  import OrganizationRole from '$lib/components/schemaorgcv/Experience.svelte';
  import { mapToObject, oxigraphStore, initOxigraph } from '$lib/stores/semantic_cv_store';
  import { get } from 'svelte/store';
  import type { IOrganizationRole } from '$lib/models/schemaorgcv';
    import type { Store, Term } from 'oxigraph';
  let mainResult: Array<any> = [];
  let organizationRoles: IOrganizationRole[] = [];
  let error = '';
  let oxistore: Store;
  let loading = true;
  // https://europa.eu/europass/elm-browser/documentation/rdf/ontology/documentation/elm.html#/
  const changeLang = (lang: string) => {
    locale.set(lang);
    loadCVData(lang);
    // localStorage.setItem('lang', lang);
  };
  
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
  async function loadCVData(lang: string = 'fr') {
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
            FILTER(LANG(?roleName) = "${lang}" || LANG(?roleName) = "")
            ?org schema:name ?employer .
            OPTIONAL {
              ?exp schema:endDate ?endDate .
            }
            OPTIONAL {
              ?exp schema:description ?description .
              FILTER(LANG(?description) = "${lang}" || LANG(?description) = "")
            }
          }
        }
        ORDER BY DESC(?endDate)
      `;

      const mainResults = oxistore?.query(EntityQuery) as unknown as Map<string, Term>[];
      const experiencesRaw = oxistore?.query(ExperiencesQuery) as unknown as Map<string, Term>[];
      //console.log(experiencesRaw);
      mainResult = mainResults.map(mapToObject);
      
      organizationRoles = (experiencesRaw.map(mapToObject) as IOrganizationRole[]).sort(compareExperience);
  }
  onMount(async () => {
    try {
      await initOxigraph(); // Exécuté uniquement côté navigateur
      const { store, oxiReady } = get(oxigraphStore);
      if (!oxiReady) {
          console.log("CV layout onMount: semantic store not ready");
          return;
        }
        oxistore = store as unknown as Store;
        loadCVData('fr');
      // const EntityQuery = `
      //   PREFIX schema: <https://schema.org/>
      //   SELECT ?fullName ?title
      //   WHERE {
      //     ?person a schema:Person ;
      //             schema:name ?fullName ;
      //             schema:jobTitle ?title .
      //   }
      // `;
      // const ExperiencesQuery = `
      //   PREFIX schema: <https://schema.org/>
      //   SELECT ?person ?roleName ?employer ?startDate ?endDate ?description ?identifier
      //   WHERE {
      //     ?person a schema:Person .

      //     OPTIONAL {
      //       ?person schema:hasOccupation ?exp .
      //       ?exp schema:roleName ?roleName ;
      //           schema:identifier ?identifier ;
      //           schema:startDate ?startDate ;
                
      //           schema:withinOrganization ?org .
      //       FILTER(LANG(?roleName) = "fr" || LANG(?roleName) = "")
      //       ?org schema:name ?employer .
      //       OPTIONAL {
      //         ?exp schema:endDate ?endDate .
      //       }
      //       OPTIONAL {
      //         ?exp schema:description ?description .
      //         FILTER(LANG(?description) = "fr" || LANG(?description) = "")
      //       }
      //     }
      //   }
      //   ORDER BY DESC(?endDate)
      // `
      //   // OPTIONAL { ?person europass:hasLanguageSkill ?lang . }
      // const mainResults = store?.query(EntityQuery) as unknown as Map<string, Term>[];
      // const experiencesRaw = store?.query(ExperiencesQuery) as unknown as Map<string, Term>[];
      // //console.log(experiencesRaw);
      // mainResult = mainResults.map(mapToObject);
      
      // organizationRoles = (experiencesRaw.map(mapToObject) as IOrganizationRole[]).sort(compareExperience);
      
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
<button on:click={() => changeLang('fr')}>FR</button>
<button on:click={() => changeLang('en')}>EN</button>
<!-- 
  <select on:change={(e) => changeLang(e.target.value)}>
    <option value="en">English</option>
    <option value="fr">Français</option>
  </select> -->
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
      <h2 class="text-3xl">Formation</h2>
      <section>

      </section>
      <h2 class="text-3xl">Langues</h2>
      <section>

      </section>
      <h2 class="text-3xl">Projets Personnels</h2>
      <section>

      </section>
  </article>
{/if}
