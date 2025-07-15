<script lang="ts">
  import { onMount } from 'svelte';

  import { formatDateFr } from '$lib/dateFormatter';
  
  import CredentialDetail from '$lib/components/schemaorgcv/CredentialDetail.svelte';
  import type { ICredentialDetails, IOrganizationRole, ISkillsDetails } from '$lib/semcv/models';
  import { listCredentials } from '$lib/semcv/adapters/credentialsAdapter';
  import { listSkills } from '$lib/semcv/adapters/skillsAdapter';
  import Skills from './Skills.svelte';
  import { browsingPreferences } from '$lib/state.svelte';
    import type { NamedNode } from 'oxigraph';
  let params: {
    organizationRole: IOrganizationRole,
    lang?: string | undefined,
    variant?: NamedNode | undefined
  } = $props()
  // export let organizationRole: ;
  let credentialsDetails: ICredentialDetails[] = $state([]);
  let skills: ISkillsDetails[] = $state([]);
  onMount(async () => {
      credentialsDetails = listCredentials(
        params.organizationRole.role,
        "schema:hasCredential",
        params.lang ? params.lang : browsingPreferences.lang,
        params.variant);
      skills = listSkills(params.organizationRole.role, "schema:skills", params.lang ? params.lang : browsingPreferences.lang);
  })
</script>

<!-- Entité RDFa : LearningActivity représentant une expérience pro -->
<div property="schema:hasOccupation"
  typeof="schema:OrganizationRole schema:Occupation schema:Organization"
  class="border-b border-gray-300 py-2 m-0 last:border-0"
>

  <!-- Typage explicite : classification ou specifiedBy -->
  <!-- {#if organizationRole.classification}
    <link property="elm:hasClassification" href={organizationRole.classification} />
  {/if} -->

  {#if params.organizationRole.roleName}
    <h3
      property="schema:roleName"
      class="text-2xl font-semibold text-gray-900 pt-1 pb-0 m-0"
    >
      {params.organizationRole.roleName.value}
    </h3>
  {/if}

  {#if params.organizationRole.employer || params.organizationRole.startDate || params.organizationRole.endDate}
    <p class="text-sm text-gray-700 p-0 m-0">
      {#if params.organizationRole.employer}
        <span property="ev:withinOrganization" class="font-medium" typeof="schema:Organization">
            <span 
              class="font-bold"
              property="schema:name">{params.organizationRole.employer.value}</span>
        </span>
      {/if}

      {#if params.organizationRole.employer && (params.organizationRole.startDate || params.organizationRole.endDate)}
        <span class="mx-2">—</span>
      {/if}
      {#if params.organizationRole.startDate && params.organizationRole.endDate}
        <span class="mx-1">de</span>
      {/if}
      {#if params.organizationRole.startDate && !params.organizationRole.endDate}
        <span class="mx-1">depuis</span>
      {/if}
      {#if params.organizationRole.startDate}
        
        <time
          property="schema:startDate"
          datetime={params.organizationRole.startDate.value}
          datatype="xsd:date"
          class="italic"
        >
          {formatDateFr(params.organizationRole.startDate.value)}
        </time>
      {/if}

      {#if params.organizationRole.startDate && params.organizationRole.endDate}
        <span class="mx-1">à</span>
      {/if}

      {#if params.organizationRole.endDate}
        <time
          property="schema:endDate"
          datetime={params.organizationRole.endDate.value}
          datatype="xsd:date"
          class="italic"
        >
          {formatDateFr(params.organizationRole.endDate.value)}
        </time>
      
      {/if}
    </p>
  {/if}

  {#if params.organizationRole.place}
    <p property="elm:hasLocation" class="text-sm text-gray-600 m-0 p-0">
      {params.organizationRole.place.value}
    </p>
  {/if}

  {#if params.organizationRole.description}
    <p property="schema:description" class="p-0 m-0 text-gray-800 text-sm whitespace-pre-line">
      {params.organizationRole.description.value}
    </p>
  {/if}
  <Skills skills={skills}></Skills>
  {#if credentialsDetails}
    <div 
      class="px-2 py-0 m-0">
      {#each credentialsDetails as credentialDetails }
            <CredentialDetail credentialDetails={credentialDetails}></CredentialDetail>
      {/each}
    </div>
  {/if}

</div>
