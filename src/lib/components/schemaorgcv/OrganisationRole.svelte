<script lang="ts">
  import { onMount } from 'svelte';

  import { formatDateFr } from '$lib/dateFormatter';
  
  import CredentialDetail from '$lib/components/schemaorgcv/CredentialDetail.svelte';
  import type { ICredentialDetails, IOrganizationRole } from '$lib/semcv/models';
  import { listCredentials } from '$lib/semcv/adapters/credentialsAdapter';
  let savedLang: string = 'en';
  export let organizationRole: IOrganizationRole;
  let credentialsDetails: ICredentialDetails[] = [];
  
  onMount(async () => {
      const stored = localStorage.getItem('lang');
      if (stored) savedLang = stored;
      credentialsDetails = listCredentials(organizationRole.role, "schema:hasCredential", savedLang);
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
