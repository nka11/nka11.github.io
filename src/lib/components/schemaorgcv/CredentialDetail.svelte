<script lang="ts">
  import { mapToObject, oxigraphStore } from '$lib/stores/semantic_cv_store';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import ProjectDetail from '$lib/components/schemaorgcv/ProjectDetail.svelte';
    import type { ICredentialDetails, IProjectDetail } from '$lib/models/schemaorgcv';
    import { formatDateFr } from '$lib/dateFormatter';
    import type { Term } from 'oxigraph';
  export let credentialDetails: ICredentialDetails = {
    credentialName: null,
    credentialIdentifier: null,
    credentialDescription: null,
    credentialEndDate: null,
    credentialStartDate: null
  };
  let projectsDetail: IProjectDetail[] = [];
  const projectsDetailsQuery = `
PREFIX schema: <https://schema.org/>

        SELECT ?projectName ?projectDescription ?projectStartDate ?projectEndDate
        WHERE {
        ?person a schema:Person .
      ?person schema:hasOccupation ?exp .
                ?exp schema:roleName ?jobTitle ;
                schema:hasCredential ?credential .
		?credential a schema:EducationalOccupationalCredential ;
  			schema:name ?credentialName .
  # ;
             
            
  OPTIONAL {
    ?credential a schema:EducationalOccupationalCredential ;
	  	schema:identifier ?identifier ;
    schema:subjectOf ?project .
  }
   FILTER(?identifier = "${credentialDetails.credentialIdentifier?.value}") .
            ?project a schema:Project ;
                      schema:name ?projectName.
            OPTIONAL {
             ?project a schema:Project ;
                  schema:description ?projectDescription .
             }
                OPTIONAL {
             ?project a schema:Project ;
                               schema:startDate ?projectStartDate .
             }
                  OPTIONAL {
             ?project a schema:Project ;
                schema:endDate ?projectEndDate .
             }

        }    ORDER BY  DESC(?projectStartDate)   `
    onMount(async () => {
        try {
            const { store, oxiReady } = get(oxigraphStore);
      if (!oxiReady) {
        console.log("OrganiwationRole component onMount: semantic store not ready");
        return;
      }
       projectsDetail = (store?.query(projectsDetailsQuery) as unknown as Map<string, Term>[]).map(mapToObject) as IProjectDetail[];
       //console.log(credentialsDetailsQuery);
       //console.log(organizationRole.identifier.value);
       //console.log(credentialsDetails);
      } catch(e) { // silent fail
        console.error(e);
      }

    })
</script>

<div typeof="schema:EducationalOccupationalCredential">
    <p 
        class="pt-1 pb-0 m-0">
        
        <span class="font-bold" property="schema:name">{credentialDetails.credentialName?.value}</span>
        {#if credentialDetails.credentialStartDate || credentialDetails.credentialEndDate}
        <span class="text-xs italic">

        <span class="mx-2">—</span>
        {#if credentialDetails.credentialStartDate && credentialDetails.credentialEndDate}
            <span class="mx-1">de</span>
        {/if}
        {#if credentialDetails.credentialStartDate && !credentialDetails.credentialEndDate}
            <span class="mx-1">depuis</span>
        {/if}
        {#if credentialDetails.credentialStartDate}
            
            <time
            property="schema:startDate"
            datetime={credentialDetails.credentialStartDate.value}
            datatype="xsd:date"
            class="italic"
            >
            {formatDateFr(credentialDetails.credentialStartDate.value)}
            </time>
        {/if}

        {#if credentialDetails.credentialStartDate && credentialDetails.credentialEndDate}
            <span class="mx-1">à</span>
        {/if}

        {#if credentialDetails.credentialEndDate}
            <time
            property="schema:endDate"
            datetime={credentialDetails.credentialEndDate.value}
            datatype="xsd:date"
            class="italic"
            >
            {formatDateFr(credentialDetails.credentialEndDate.value)}
            </time>
        
        {/if}
        </span>
        {/if}
    </p>
    {#if credentialDetails.credentialDescription}
         <p 
            class="p-0 m-0"
            property="schema:description">{credentialDetails.credentialDescription.value}</p>
    {/if}
    {#if projectsDetail}
        <div
            class="px-2 pt-0 pb-0 m-0"
            property="schema:subjectOf">
            {#each projectsDetail as projectDetail}
                <ProjectDetail projectDetail={projectDetail}></ProjectDetail>
            {/each}
        </div>
    {/if}
</div>
