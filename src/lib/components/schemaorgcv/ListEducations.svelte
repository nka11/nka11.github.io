<script lang="ts">
  import { mapToObject, oxigraphStore } from '$lib/schemaorgcv/semantic_cv_store';
    import type { Term } from 'oxigraph';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { extractYear } from '$lib/dateFormatter';
    import type { IEducationDetails } from '$lib/schemaorgcv/models';
    import Education from './Education.svelte';
  let savedLang: string = 'en';

  const projectsDetailsQuery = ``;
  let educationDetails: IEducationDetails[];
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
			?educ schema:name ?educName .
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
       educationDetails = (store?.query(eduQuery) as unknown as Map<string, Term>[]).map(mapToObject) as unknown as IEducationDetails[];
       //console.log(credentialsDetailsQuery);
       //console.log(organizationRole.identifier.value);
       //console.log(credentialsDetails);
      } catch(e) { // silent fail
        console.error(e);
      }

  });
</script>

{#each educationDetails as education }
    <Education education={ education }></Education>
{/each}