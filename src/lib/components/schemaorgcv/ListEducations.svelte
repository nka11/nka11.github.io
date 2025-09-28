<script lang="ts">
  import { onMount } from 'svelte';
  import type { IEducationDetails, IPersonDetails } from '$lib/semcv/models';
  import Education from './Education.svelte';
  import { listEducations } from '$lib/semcv/adapters/educationAdapters';
    import type { NamedNode } from 'oxigraph';
    import { browsingPreferences } from '$lib/state.svelte';
  export let of: NamedNode;
  let educationDetails: IEducationDetails[];
    onMount(async () => {
      educationDetails = listEducations(of, "schema:alumniOf", browsingPreferences.lang);
  });
</script>

{#each educationDetails as education }
    <Education education={ education }></Education>
{/each}