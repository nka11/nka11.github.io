<script lang="ts">
  import { onMount } from 'svelte';
  import type { IEducationDetails, IPersonDetails } from '$lib/semcv/models';
  import Education from './Education.svelte';
  import { listEducations } from '$lib/semcv/adapters/educationAdapters';
    import type { NamedNode } from 'oxigraph';
  let savedLang: string = 'en';
  export let of: NamedNode;
  let educationDetails: IEducationDetails[];
    onMount(async () => {
      const stored = localStorage.getItem('lang');
      if (stored) savedLang = stored;
      educationDetails = listEducations(of, "schema:alumniOf", savedLang);
  });
</script>

{#each educationDetails as education }
    <Education education={ education }></Education>
{/each}