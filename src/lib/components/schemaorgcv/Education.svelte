<script lang="ts">
    import { extractYear } from '$lib/dateFormatter';
    import { listSkills } from '$lib/schemaorgcv/adapters/skillsAdapter';
    import type { IEducationDetails, ISkillsDetails } from '$lib/schemaorgcv/models';
  import { onMount } from 'svelte';
    import Skills from './Skills.svelte';

  export let education: IEducationDetails;
  let skills: ISkillsDetails[] = [];
  let savedLang: string = 'en';
    onMount(async () => {
      const stored = localStorage.getItem('lang');
      if (stored) savedLang = stored;
      skills = listSkills(education.educ, "schema:competencyRequired", savedLang);
  });
</script>

{#if education}
<section class="bg-gray-100 py-1 px-2 m-0 rounded-lg shadow-md">
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
     
    </section>
  
{/if}