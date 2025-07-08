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

        SELECT ?educ ?educName ?educLocation ?educLevel
        WHERE {
          	?person a schema:Person .
          	?person schema:alumniOf ?educ .
			?educ schema:name ?educName
                      .
            OPTIONAL {
              ?educ schema:educationalLevel ?educLevel .
            }

            OPTIONAL {
              ?educ schema:location ?educLocation .
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
  <div>
  {education.educName.value}

  {education.educLevel.value}  
  {#if education.educLocation }
    {education.educLocation.value}  
  {/if}
  </div>
{/each}