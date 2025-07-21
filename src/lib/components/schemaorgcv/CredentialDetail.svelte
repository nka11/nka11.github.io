<script lang="ts">
  import { onMount } from 'svelte';
  import ProjectDetail from '$lib/components/schemaorgcv/ProjectDetail.svelte';
  import type { ICredentialDetails, IProjectDetail, ISkillsDetails } from '$lib/semcv/models';
  import { formatDateFr } from '$lib/dateFormatter';
  import { listSkills } from '$lib/semcv/adapters/skillsAdapter';
  import { listProjects } from '$lib/semcv/adapters/projectsAdapter';
    import CycleProject from './CycleProject.svelte';
  export let credentialDetails: ICredentialDetails;
  let savedLang: string = 'en';
  let projectsDetail: IProjectDetail[] = [];
  let skills: ISkillsDetails[] = [];
  onMount(async () => {

        const stored = localStorage.getItem('lang');
        if (stored) savedLang = stored;
        skills = listSkills(credentialDetails.credential, "schema:about", savedLang);
       projectsDetail = listProjects(credentialDetails.credential, "schema:subjectOf", savedLang);
    })
</script>

<div property="schema:hasCredential" typeof="schema:EducationalOccupationalCredential schema:OrganizationRole">
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
    <div property="schema:description"></div>
        {#each credentialDetails.credentialDescription.value.split('\n') as desciptionLine}
            <p class="px-2 m-0 text-sm pl-2">
                {desciptionLine}
            </p>
                
        {/each}
    {/if}
    {#if projectsDetail.length > 0}
        <div
            class="px-2 pt-0 pb-0 m-0"
            >
            {#each projectsDetail as projectDetail}
                <CycleProject project={projectDetail}></CycleProject>
                <!-- <ProjectDetail projectDetail={projectDetail}></ProjectDetail> -->
            {/each}
        </div>
    {/if}
</div>
