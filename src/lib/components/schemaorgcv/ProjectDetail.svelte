<script lang="ts">
  import { formatDateFr } from "$lib/dateFormatter";
    import { listSkills } from "$lib/semcv/adapters/skillsAdapter";
  import type { IProjectDetail, ISkillsDetails } from "$lib/semcv/models";
  import { onMount } from "svelte";
    import Skills from "./Skills.svelte";

  export let projectDetail: IProjectDetail;
  let skills: ISkillsDetails[];
  let savedLang: string = 'en';
  onMount(async () => {
        const stored = localStorage.getItem('lang');
        if (stored) savedLang = stored;
        skills = listSkills(projectDetail.project, "schema:about", savedLang)
}) 

</script>

<div 
  class="pt-1 m-1 pb-0 bg-gray-100 rounded-lg shadow-md"
  property="schema:subjectOf"
  typeof="schema:CreativeWork schema:Project schema:Role">
  <span class="text-sm p-0 m-0">
    <span class="font-bold" property="schema:name">{projectDetail.projectName?.value}</span>
    {#if projectDetail.roleName}
      <span class="italic text-xs p-0 m-0"
          property="schema:roleName">({ projectDetail.roleName.value })</span>
    {/if}
    :
    {#if projectDetail.projectStartDate || projectDetail.projectEndDate}
      
      <span class="text-xs italic">
        <span class="mx-2">—</span>
        {#if projectDetail.projectStartDate && projectDetail.projectEndDate}
          <span class="mx-1">de</span>
        {/if}
        {#if projectDetail.projectStartDate && !projectDetail.projectEndDate}
          <span class="mx-1">depuis</span>
        {/if}
        {#if projectDetail.projectStartDate}
          
          <time
            property="schema:startDate"
            datetime={projectDetail.projectStartDate.value}
            datatype="xsd:date"
            class="italic"
          >
            {formatDateFr(projectDetail.projectStartDate.value)}
          </time>
        {/if}

        {#if projectDetail.projectStartDate && projectDetail.projectEndDate}
          <span class="mx-1">à</span>
        {/if}

        {#if projectDetail.projectEndDate}
          <time
            property="schema:endDate"
            datetime={projectDetail.projectEndDate.value}
            datatype="xsd:date"
            class="italic"
          >
            {formatDateFr(projectDetail.projectEndDate.value)}
          </time>
        
        {/if}
      </span>
    {/if}
  </span>
  {#if projectDetail.roleName}
    <div class="italic text-xs p-0 m-0"
  property="schema:roleName">{ projectDetail.roleName.value }</div>
  {/if}

  {#if projectDetail.projectDescription}   
  <p 
  class="whitespace-pre-line text-xs p-0 m-0"
  property="schema:description">
      { projectDetail.projectDescription.value }
  </p>
  {/if}
  <Skills skills={skills}></Skills>
</div>