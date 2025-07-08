<script lang="ts">
  import { locale, _ } from 'svelte-i18n';
  import { mapToObject, oxigraphStore } from '$lib/stores/semantic_cv_store';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';

  import { formatDateFr } from '$lib/dateFormatter';
  
  import CredentialDetail from '$lib/components/schemaorgcv/CredentialDetail.svelte';
    import type { ICredentialDetails, IOrganizationRole } from '$lib/models/schemaorgcv';
    import type { Term } from 'oxigraph';
  let savedLang: string = 'en';
  export let organizationRole: IOrganizationRole = {
    roleName: null,
    employer: null,
    startDate: null,
    endDate: null,
    description: null,
    place: null,
    identifier: null,
    //classification: "http://data.europa.eu/snb/elm/classification/workbasedlearning" // ou null
  };
  let credentialsDetails: ICredentialDetails[] = [];
  
  onMount(async () => {
      const stored = localStorage.getItem('lang');
      if (stored) savedLang = stored;
      
      const { store, oxiReady } = get(oxigraphStore);
      if (!oxiReady) {
        console.log("Experience component onMount: semantic store not ready");
        return;
      }
      const credentialsDetailsQuery = `
          PREFIX aschema: <https://schema.ld.admin.ch/>
    PREFIX schema: <https://schema.org/>

    SELECT ?person ?identifier ?credentialName ?credentialDescription ?credentialIdentifier ?credentialStartDate ?credentialEndDate
    WHERE {
      ?person a schema:Person .
      ?person schema:hasOccupation ?exp .
                ?exp schema:roleName ?jobTitle ;
                schema:identifier ?identifier ;
                schema:hasCredential ?credential .
      FILTER(LANG(?jobTitle) = "${savedLang}" || LANG(?jobTitle) = "")
      FILTER(?identifier = "${organizationRole.identifier?.value}") .

      ?credential a schema:EducationalOccupationalCredential ;
                schema:identifier ?credentialIdentifier ;
                schema:name ?credentialName .
      FILTER(LANG(?credentialName) = "${savedLang}" || LANG(?credentialName) = "")
      OPTIONAL {
        ?credential a schema:EducationalOccupationalCredential ;
              schema:description ?credentialDescription .
        FILTER(LANG(?credentialDescription) = "${savedLang}" || LANG(?credentialDescription) = "")
    
      }
      OPTIONAL {
        ?credential a schema:EducationalOccupationalCredential ;
              schema:startDate ?credentialStartDate .
        
      }
      OPTIONAL {
        ?credential a schema:EducationalOccupationalCredential ;
              schema:endDate ?credentialEndDate .
      }
    } ORDER BY  DESC(?credentialStartDate)
    `;
//     PREFIX schema: <https://schema.org/>

// SELECT ?credentialName ?projectName ?projectDesc
// WHERE {
// ?person a schema:Person .

// # Rôle de la personne dans une organisation
// ?person schema:hasOccupation ?exp .
//         ?exp schema:roleName ?jobTitle ;
//         schema:identifier ?identifier ;
//         schema:hasCredential ?credential .

// FILTER(?identifier = "${organizationRole.identifier.value}") .

// ?credential a schema:EducationalOccupationalCredential ;
//           schema:name ?credentialName ;
//           schema:subjectOf ?project .

// # Projet lié au credential
// ?project a schema:Project ;
//        schema:name ?projectName ;
//        schema:description ?projectDesc .
// }
// # ORDER BY ?person ?credentialName ?projectName
      try {
       credentialsDetails = (store?.query(credentialsDetailsQuery) as unknown as Map<string, Term>[]).map(mapToObject) as ICredentialDetails[];
       //console.log(credentialsDetailsQuery);
       //console.log(organizationRole.identifier.value);
       //console.log(credentialsDetails);
      } catch(e) { // silent fail
        console.error(e);
      }

  })
</script>

<!-- Entité RDFa : LearningActivity représentant une expérience pro -->
<div property="schema:hasOccupation"
  typeof="schema:OrganizationRole schema:Occupation  schema:Organization"
  class="border-b border-gray-300 py-2 m-0 last:border-0"
>

  <!-- Typage explicite : classification ou specifiedBy -->
  <!-- {#if organizationRole.classification}
    <link property="elm:hasClassification" href={organizationRole.classification} />
  {/if} -->

  {#if organizationRole.roleName}
    <h3
      property="schema:roleName"
      class="text-2xl font-semibold text-gray-900 pt-1 pb-0 m-0"
    >
      {organizationRole.roleName.value}
    </h3>
  {/if}

  {#if organizationRole.employer || organizationRole.startDate || organizationRole.endDate}
    <p class="text-sm text-gray-700 p-0 m-0">
      {#if organizationRole.employer}
        <span property="ev:withinOrganization" class="font-medium" typeof="schema:Organization">
            <span 
              class="font-bold"
              property="schema:name">{organizationRole.employer.value}</span>
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
    <p property="elm:hasLocation" class="text-sm text-gray-600 m-0 p-0">
      {organizationRole.place.value}
    </p>
  {/if}

  {#if organizationRole.description}
    <p property="schema:description" class="p-0 m-0 text-gray-800 text-sm whitespace-pre-line">
      {organizationRole.description.value}
    </p>
  {/if}
  {#if credentialsDetails}
    <div 
      class="px-2 py-0 m-0">
      {#each credentialsDetails as credentialDetails }
            <CredentialDetail credentialDetails={credentialDetails}></CredentialDetail>
      {/each}
    </div>
  {/if}

</div>
