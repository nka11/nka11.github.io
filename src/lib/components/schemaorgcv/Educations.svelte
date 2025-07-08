<script lang="ts">
  import { mapToObject, oxigraphStore } from '$lib/stores/semantic_cv_store';
    import type { Term } from 'oxigraph';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  let savedLang: string = 'en';

  const projectsDetailsQuery = ``;
  let educationDetails: any;
    onMount(async () => {
      const stored = localStorage.getItem('lang');
      if (stored) savedLang = stored;
      
      const { store, oxiReady } = get(oxigraphStore);
      if (!oxiReady) {
        console.log("Template component onMount: semantic store not ready");
        return;
      }
      const eduQuery=`
		PREFIX schema: <https://schema.org/>

        SELECT ?educ ?educName ?educLocationName ?educLocationAddress ?educLevel ?educStart ?educEnd
        WHERE {
          	?person a schema:Person .
          	?person schema:alumniOf ?educ .
			?educ schema:name ?educName
                      .
            OPTIONAL {
              ?educ schema:educationalLevel ?educLevel .
            }
            OPTIONAL {
              ?educ schema:startDate ?educStart .
            }
            OPTIONAL {
              ?educ schema:endDate ?educEnd .
            }
            OPTIONAL {
              ?educ schema:location ?locationEntity .
              ?locationEntity schema:name ?educLocationName .
              OPTIONAL {
                ?locationEntity schema:address ?educLocationAddress .
              }
        }
	}
      `
      try {
       educationDetails = (store?.query(eduQuery) as unknown as Map<string, Term>[]).map(mapToObject);
       //console.log(credentialsDetailsQuery);
       //console.log(organizationRole.identifier.value);
       //console.log(credentialsDetails);
      } catch(e) { // silent fail
        console.error(e);
      }

  });
</script>

{#each educationDetails as education }
    <section class="bg-gray-100 py-1 px-2 m-0 rounded-lg shadow-md">
      <p class="text-xl font-semibold p-0 m-0">{education.educName.value}</p>
      <p class="text-sm text-gray-700 p-0 mt-0 mb-1"><strong>Niveau :</strong> {education.educLevel.value}</p>
      {#if education.educLocationName }
        <p class="text-sm text-gray-700 p-0 mt-0 mb-1"><strong>Établissement :</strong> {education.educLocationName.value}</p>
      {/if}
      {#if education.educLocationAddress }
        <p class="text-sm text-gray-700 p-0 mt-0 mb-1"><strong>Adresse :</strong> {education.educLocationAddress.value}</p>
      {/if}
      {#if education.educEnd }
        <p class="text-sm text-gray-700 p-0 mt-0 mb-1"><strong>Date de fin :</strong> {education.educEnd.value}</p>
      {/if}
    </section>
{/each}