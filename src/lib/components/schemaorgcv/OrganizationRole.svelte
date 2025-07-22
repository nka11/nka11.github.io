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
  } = $props();

  let credentialsDetails: ICredentialDetails[] = $state([]);
  let skills: ISkillsDetails[] = $state([]);

  onMount(async () => {
    credentialsDetails = listCredentials(
      params.organizationRole.role,
      "schema:hasCredential",
      params.lang ?? browsingPreferences.lang,
      params.variant
    );
    skills = listSkills(
      params.organizationRole.role,
      "schema:skills",
      params.lang ?? browsingPreferences.lang
    );
  });
</script>

<div 
  class="org-role-container"
  property="schema:hasOccupation"
  typeof="schema:OrganizationRole schema:Occupation schema:Organization"
>
  {#if params.organizationRole.roleName}
    <h3
      class="org-role-title"
      property="schema:roleName"
    >
      {params.organizationRole.roleName.value}
    </h3>
  {/if}

  {#if params.organizationRole.employer || params.organizationRole.startDate || params.organizationRole.endDate}
    <p class="org-role-info">
      {#if params.organizationRole.employer}
        <span property="nkonto:withinOrganization" typeof="schema:Organization" class="org-employer">
          <span property="schema:name" class="org-employer-name">
            {params.organizationRole.employer.value}
          </span>
        </span>
      {/if}

      {#if params.organizationRole.employer && (params.organizationRole.startDate || params.organizationRole.endDate)}
        <span class="separator">—</span>
      {/if}

      {#if params.organizationRole.startDate && params.organizationRole.endDate}
        <span class="range-label">de</span>
      {/if}
      {#if params.organizationRole.startDate && !params.organizationRole.endDate}
        <span class="range-label">depuis</span>
      {/if}

      {#if params.organizationRole.startDate}
        <time
          property="schema:startDate"
          datetime={params.organizationRole.startDate.value}
          datatype="xsd:date"
          class="italic-date"
        >
          {formatDateFr(params.organizationRole.startDate.value)}
        </time>
      {/if}

      {#if params.organizationRole.startDate && params.organizationRole.endDate}
        <span class="range-label">à</span>
      {/if}

      {#if params.organizationRole.endDate}
        <time
          property="schema:endDate"
          datetime={params.organizationRole.endDate.value}
          datatype="xsd:date"
          class="italic-date"
        >
          {formatDateFr(params.organizationRole.endDate.value)}
        </time>
      {/if}
    </p>
  {/if}

  {#if params.organizationRole.place}
    <p class="org-role-place" property="elm:hasLocation">
      {params.organizationRole.place.value}
    </p>
  {/if}

  {#if params.organizationRole.description}
    <p class="org-role-description" property="schema:description">
      {params.organizationRole.description.value}
    </p>
  {/if}

  <Skills skills={skills} />

  {#if credentialsDetails}
    <div class="credentials-wrapper">
      {#each credentialsDetails as credentialDetails}
        <CredentialDetail credentialDetails={credentialDetails} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .org-role-container {
    margin: 0;
    padding: 1rem;
    border: 1px solid #e5e7eb; /* light gray */
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    background-color: #fff;
  }

  .org-role-title {
    margin: 0;
    padding-top: 0.25rem;
    padding-bottom: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
  }

  .org-role-info {
    font-size: 0.875rem;
    color: #374151;
    margin: 0;
    padding: 0;
  }

  .org-employer {
    font-weight: 500;
  }

  .org-employer-name {
    font-weight: bold;
  }

  .separator {
    margin: 0 0.5rem;
  }

  .range-label {
    margin: 0 0.25rem;
  }

  .italic-date {
    font-style: italic;
  }

  .org-role-place {
    font-size: 0.875rem;
    color: #4b5563;
    margin: 0;
    padding: 0;
  }

  .org-role-description {
    font-size: 0.875rem;
    color: #1f2937;
    margin: 0.5rem 0 0;
    padding: 0;
    white-space: pre-line;
    text-align: justify;
  }

  .credentials-wrapper {
    margin: 0;
    padding: 0.5rem;
  }
</style>
