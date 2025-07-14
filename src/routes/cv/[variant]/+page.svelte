<script lang="ts">
  import { onMount } from 'svelte';
  import { error } from '@sveltejs/kit';
    import type { IVariantsDetails } from '$lib/semcv/models';

  export let data: {
    metadata:IVariantsDetails;
    variant: string;
  };

  let ContentComponent: any;
  console.log(data);
  onMount(async () => {

    
  });
</script>

<article class="prose max-w-none">
  <!-- <h1>{data.metadata.name}</h1> -->
  <!-- <p class="text-sm text-gray-500">{new Date(data.metadata.date).toLocaleDateString()}</p> -->
  <!-- <p class="mb-6">{data.metadata.description}</p> -->

  {#if ContentComponent}
    <svelte:component this={ContentComponent} />
  {:else}
    <p>Chargement du contenu...</p>
  {/if}
</article>
