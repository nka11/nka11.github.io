<script lang="ts">
    import { extractYear } from '$lib/dateFormatter';
    import { listSkills } from '$lib/semcv/adapters/skillsAdapter';
    import type { IEducationDetails, IProjectDetail, ISkillsDetails } from '$lib/semcv/models';
  import { onMount } from 'svelte';
    import Skills from './Skills.svelte';
    import { listProjects } from '$lib/semcv/adapters/projectsAdapter';
    import ProjectDetail from './ProjectDetail.svelte';

  export let education: IEducationDetails;
  let skills: ISkillsDetails[] = [];
  let projects: IProjectDetail[] = [];
  let savedLang: string = 'en';
    onMount(async () => {
      const stored = localStorage.getItem('lang');
      if (stored) savedLang = stored;
      skills = listSkills(education.educ, "schema:competencyRequired", savedLang);
      projects = listProjects(education.educ, "schema:subjectOf", savedLang);
  });
</script>

{#if education}
<section class=" py-1 px-2 m-2">
  <p class="text-xl font-semibold p-0 m-0">
      {#if education.educEnd }
      <span>{extractYear(education.educEnd.value)}</span> — 
    {/if}
    {education.educName?.value}
  </p>
  <p class="text-sm text-gray-700 p-0 mt-0 mb-1"><strong>Niveau :</strong> {education.educLevel?.value}</p>
  {#if education.educLocationName }
    <p class="text-sm text-gray-700 p-0 mt-0 mb-1"><strong>Établissement :</strong> {education.educLocationName.value}</p>
  {/if}
  {#if education.educLocationAddress }
    <p class="text-sm text-gray-700 p-0 mt-0 mb-1"><strong>Adresse :</strong> {education.educLocationAddress.value}</p>
  {/if}
  <Skills skills={skills}></Skills>
  {#if projects.length > 0}
    <div
        class="px-2 pt-0 pb-0 m-0"
        >
        {#each projects as projectDetail}
            <ProjectDetail projectDetail={projectDetail}></ProjectDetail>
        {/each}
    </div>
  {/if}
  
      
     
    </section>
  
{/if}