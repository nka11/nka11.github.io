<script lang="ts">
  import { onMount } from 'svelte';
  import { error } from '@sveltejs/kit';
    import type { IPersonDetails, IVariantsDetails } from '$lib/semcv/models';
    import { namedNode, type NamedNode } from 'oxigraph';
    import { getPerson } from '$lib/semcv/adapters/personAdapters';
    import VariantCv from '$lib/components/schemaorgcv/VariantCV.svelte';
    import { initOxigraph, oxigraphStore } from '$lib/semcv/semantic_cv_store';
    import CvMenu from '../CVMenu.svelte';
    import { browsingPreferences } from '$lib/state.svelte';
    import { get } from 'svelte/store';

  export let data: {
    dataFiles: string[];
    metadata:string;
    variant: string;
  };
  let variantNode: NamedNode;
  let personNode: NamedNode;// = namedNode("https://nka11.github.io/#me");
  // let person:IPersonDetails;
  console.log(data);
  onMount(async () => {
      await initOxigraph(data.dataFiles); // Exécuté uniquement côté navigateur
      const { store, oxiReady } = get(oxigraphStore);
      if (!oxiReady) {
        console.log("CV layout onMount: semantic store not ready");
        return;
      }
    variantNode = namedNode(data.metadata);
    personNode = namedNode("https://nka11.github.io/#me");
    // console.log(variantNode);
    // person = getPerson(personNode,browsingPreferences.lang,variantNode);

  });
</script>
{#key browsingPreferences.lang}
{#if variantNode}
  
<CvMenu person={ personNode }></CvMenu>

<article class="prose max-w-none">
<!-- <p class="text-sm text-gray-500">{new Date(data.metadata.date).toLocaleDateString()}</p> -->
<!-- <p class="mb-6">{data.metadata.description}</p> -->

<VariantCv variant={ variantNode } person={ personNode }></VariantCv>
</article>
{/if}
  
{/key}
