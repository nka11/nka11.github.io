<script lang="ts">
  import { mapToObject, oxigraphStore } from '$lib/stores/semantic_cv_store';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import ProjectDetail from '$lib/components/ProjectDetail.svelte';
  export let credentialDetails = {
    credentialName: null,
    credentialIdentifier: null,
    credentialDescription: null,
    credentialEndDate: null,
    credentialStartDate: null
  };
  let projectsDetail: any = null;
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
   FILTER(?identifier = "${credentialDetails.credentialIdentifier.value}") .
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
       projectsDetail = store.query(projectsDetailsQuery).map(mapToObject);
       //console.log(credentialsDetailsQuery);
       //console.log(organizationRole.identifier.value);
       //console.log(credentialsDetails);
      } catch(e) { // silent fail
        console.error(e);
      }

    })
      function formatDateFr(dateStr) {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      if (isNaN(date)) return null;
      const day = date.getDate();
      // const dayStr = day === 1 ? "1er" : day;
      const month = date.toLocaleString("fr-FR", { month: "long" });
      const year = date.getFullYear();
      return `${month} ${year}`;
    } catch {
      return dateStr;
    }
  }
</script>

<div typeof="schema:EducationalOccupationalCredential">
    <p 
        class="pt-1 pb-0 m-0">
        
        <span class="font-bold" property="schema:name">{credentialDetails.credentialName.value}</span>
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
