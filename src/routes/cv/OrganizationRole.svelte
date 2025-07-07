<script lang="ts">
  import { mapToObject, oxigraphStore, initOxigraph } from '$lib/stores/semantic_cv_store_cv_store';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import ProjectDetail from '$lib/components/ProjectDetail.svelte';
  export let organizationRole = {
    roleName: null,
    employer: null,
    startDate: null,
    endDate: null,
    description: null,
    place: null,
    identifier: null,
    classification: "http://data.europa.eu/snb/elm/classification/workbasedlearning" // ou null
  };
  let credentialsDetails: any = null;
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
  onMount(async () => {
      const { store, oxiReady } = get(oxigraphStore);
      if (!oxiReady) return;
      const credentialsDetailsQuery = `
        PREFIX schema: <https://schema.org/>

SELECT ?credentialName ?projectName ?projectDesc
WHERE {
  ?person a schema:Person .

  # Rôle de la personne dans une organisation
  ?person schema:hasOccupation ?exp .
            ?exp schema:roleName ?jobTitle ;
            schema:identifier ?identifier ;
            schema:hasCredential ?credential .

  FILTER(?identifier = "${organizationRole.identifier.value}") .

  ?credential a schema:EducationalOccupationalCredential ;
              schema:name ?credentialName ;
              schema:subjectOf ?project .

  # Projet lié au credential
  ?project a schema:Project ;
           schema:name ?projectName ;
           schema:description ?projectDesc .
}
# ORDER BY ?person ?credentialName ?projectName
      `;
      try {
       credentialsDetails = store.query(credentialsDetailsQuery).map(mapToObject);
       //console.log(credentialsDetailsQuery);
       //console.log(organizationRole.identifier.value);
       //console.log(credentialsDetails);
      } catch(e) { // silent fail
        console.error(e);
      }

  })
</script>

<!-- Entité RDFa : LearningActivity représentant une expérience pro -->
<div
  typeof="schema:OrganizationRole"
  class="border-b border-gray-300 py-4 last:border-0"
>

  <!-- Typage explicite : classification ou specifiedBy -->
  <!-- {#if organizationRole.classification}
    <link property="elm:hasClassification" href={organizationRole.classification} />
  {/if} -->

  {#if organizationRole.roleName}
    <h3
      property="schema:roleName"
      class="text-2xl font-semibold text-gray-900"
    >
      {organizationRole.roleName.value}
    </h3>
  {/if}

  {#if organizationRole.employer || organizationRole.startDate || organizationRole.endDate}
    <p class="text-sm text-gray-700 mb-1">
      {#if organizationRole.employer}
        <span property="schema:memberOf" class="font-medium">
          <span typeof="schema:Organization">
            <span property="schema:name">{organizationRole.employer.value}</span>
          </span>
        </span>
      {/if}

      {#if organizationRole.employer && (organizationRole.startDate || organizationRole.endDate)}
        <span class="mx-2">—</span>
      {/if}
      {#if organizationRole.startDate && organizationRole.endDate}
        <span class="mx-1">de</span>
      {/if}
      {#if organizationRole.startDate && !organizationRole.endDate}
        <span class="mx-1">depuis</span>
      {/if}
      {#if organizationRole.startDate}
        
        <time
          property="schema:startDate"
          datetime={organizationRole.startDate.value}
          datatype="xsd:date"
          class="italic"
        >
          {formatDateFr(organizationRole.startDate.value)}
        </time>
      {/if}

      {#if organizationRole.startDate && organizationRole.endDate}
        <span class="mx-1">à</span>
      {/if}

      {#if organizationRole.endDate}
        <time
          property="schema:endDate"
          datetime={organizationRole.endDate.value}
          datatype="xsd:date"
          class="italic"
        >
          {formatDateFr(organizationRole.endDate.value)}
        </time>
      
      {/if}
    </p>
  {/if}

  {#if organizationRole.place}
    <p property="elm:hasLocation" class="text-sm text-gray-600 mb-1">
      {organizationRole.place.value}
    </p>
  {/if}

  {#if organizationRole.description}
    <p property="schema:description" class="text-gray-800 text-sm whitespace-pre-line">
      {organizationRole.description.value}
    </p>
  {/if}
  {#if credentialsDetails}
    {#each credentialsDetails as projectDetail }
          <ProjectDetail projectDetail={projectDetail}></ProjectDetail>
    {/each}
  {/if}

</div>
