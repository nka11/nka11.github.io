<script lang="ts">
  import { onMount } from 'svelte';
  import { namedNode, type NamedNode } from 'oxigraph';
  import VariantCv from '$lib/components/schemaorgcv/VariantCV.svelte';
  import { initOxigraph, oxigraphStore } from '$lib/semcv/semantic_cv_store';
  import CvMenu from '../../../lib/components/schemaorgcv/CVMenu.svelte';
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
  
<CvMenu person={ personNode } variant={variantNode}></CvMenu>

<article class="prose max-w-none">
  <VariantCv variant={ variantNode } person={ personNode }></VariantCv>
</article>
{/if}
  
{/key}
