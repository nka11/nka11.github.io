<script lang="ts">
  import { formatDateFr } from "$lib/dateFormatter";
  import { listSkills } from "$lib/semcv/adapters/skillsAdapter";
  import type { IProjectDetail, ISkillsDetails } from "$lib/semcv/models";
  import { onMount } from "svelte";
  import Skills from "./Skills.svelte";

  export let projectDetail: IProjectDetail;
  let skills: ISkillsDetails[] = [];
  let savedLang: string = 'en';

  onMount(async () => {
    const stored = localStorage.getItem('lang');
    if (stored) savedLang = stored;
    skills = listSkills(projectDetail.project, "schema:about", savedLang);
  });
</script>

<div 
  class="project-container"
  property="schema:subjectOf"
  typeof="schema:CreativeWork schema:Project schema:Role"
>
  <span class="project-header">
    <span class="project-title" property="schema:name">{projectDetail.projectName?.value}</span>
    {#if projectDetail.roleName}
      <span class="project-role-inline" property="schema:roleName">({ projectDetail.roleName.value })</span>
    {/if}
    :
    {#if projectDetail.projectStartDate || projectDetail.projectEndDate}
      <span class="project-dates">
        <span class="date-separator">—</span>

        {#if projectDetail.projectStartDate && projectDetail.projectEndDate}
          <span class="date-label">de</span>
        {/if}
        {#if projectDetail.projectStartDate && !projectDetail.projectEndDate}
          <span class="date-label">depuis</span>
        {/if}
        {#if projectDetail.projectStartDate}
          <time
            property="schema:startDate"
            datetime={projectDetail.projectStartDate.value}
            datatype="xsd:date"
            class="project-date"
          >
            {formatDateFr(projectDetail.projectStartDate.value)}
          </time>
        {/if}

        {#if projectDetail.projectStartDate && projectDetail.projectEndDate}
          <span class="date-label">à</span>
        {/if}

        {#if projectDetail.projectEndDate}
          <time
            property="schema:endDate"
            datetime={projectDetail.projectEndDate.value}
            datatype="xsd:date"
            class="project-date"
          >
            {formatDateFr(projectDetail.projectEndDate.value)}
          </time>
        {/if}
      </span>
    {/if}
  </span>

  {#if projectDetail.roleName}
    <div class="project-role" property="schema:roleName">
      {projectDetail.roleName.value}
    </div>
  {/if}

  {#if projectDetail.projectDescription}
    <p class="project-description" property="schema:description">
      {projectDetail.projectDescription.value}
    </p>
  {/if}

  <Skills skills={skills} />
</div>

<style>
  .project-container {
    padding-top: 0.25rem;
    padding-bottom: 0;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    margin: 1rem;
    background-color: #f3f4f6; /* light gray */
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb; /* light border */
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }

  .project-header {
    font-size: 0.875rem;
    margin: 0;
    padding: 0;
  }

  .project-title {
    font-weight: bold;
  }

  .project-role-inline {
    font-style: italic;
    font-size: 0.75rem;
    margin: 0;
    padding: 0;
  }

  .project-dates {
    font-size: 0.75rem;
    font-style: italic;
  }

  .date-separator {
    margin: 0 0.5rem;
  }

  .date-label {
    margin: 0 0.25rem;
  }

  .project-date {
    font-style: italic;
  }

  .project-role {
    font-style: italic;
    font-size: 0.75rem;
    margin: 0;
    padding: 0;
  }

  .project-description {
    white-space: pre-line;
    text-align: justify;
    font-size: 1rem;
    margin: 0.5rem 0 0;
    padding: 0;
  }
</style>
