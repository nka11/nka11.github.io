<script lang="ts">
    import { extractYear } from '$lib/dateFormatter';
    import { listSkills } from '$lib/semcv/adapters/skillsAdapter';
    import type { IEducationDetails, IProjectDetail, ISkillsDetails } from '$lib/semcv/models';
  import { onMount } from 'svelte';
    import Skills from './Skills.svelte';
    import { listProjects } from '$lib/semcv/adapters/projectsAdapter';
    import ProjectDetail from './ProjectDetail.svelte';
    import { browsingPreferences } from '$lib/state.svelte';

  let params:{
    education: IEducationDetails,
    lang?: string
  } = $props();
  let skills: ISkillsDetails[] = $state([]);
  let projects: IProjectDetail[] = $state([]);
  onMount(async () => {
    skills = listSkills(params.education.educ, "schema:competencyRequired", params.lang ? params.lang : browsingPreferences.lang);
    projects = listProjects(params.education.educ, "schema:subjectOf", params.lang ? params.lang : browsingPreferences.lang);
  });
</script>

{#if params.education}
<h2 class="text-3xl">Formations et diplômes</h2>
<section class="py-1 px-2 m-2">
  <p class="text-xl font-semibold p-0 m-0">
      {#if params.education.educEnd }
      <span>{extractYear(params.education.educEnd.value)}</span> — 
    {/if}
    {params.education.educName?.value}
  </p>
  <p class="text-sm text-gray-700 p-0 mt-0 mb-1"><strong>Niveau :</strong> {params.education.educLevel?.value}</p>
  {#if params.education.educLocationName }
    <p class="text-sm text-gray-700 p-0 mt-0 mb-1"><strong>Établissement :</strong> {params.education.educLocationName.value}</p>
  {/if}
  {#if params.education.educLocationAddress }
    <p class="text-sm text-gray-700 p-0 mt-0 mb-1"><strong>Adresse :</strong> {params.education.educLocationAddress.value}</p>
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