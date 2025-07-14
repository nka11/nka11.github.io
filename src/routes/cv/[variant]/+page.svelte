<script lang="ts">
  import { onMount } from 'svelte';
  import { error } from '@sveltejs/kit';
    import type { IPersonDetails, IVariantsDetails } from '$lib/semcv/models';
    import { namedNode, type NamedNode } from 'oxigraph';
    import { getPerson } from '$lib/semcv/adapters/personAdapters';
    import VariantCv from '$lib/components/schemaorgcv/VariantCV.svelte';
    import { initOxigraph } from '$lib/semcv/semantic_cv_store';

  export let data: {
    dataFiles: string[];
    metadata:string;
    variant: string;
  };
  let variantNode: NamedNode;
  let person: IPersonDetails;
  console.log(data);
  onMount(async () => {
      await initOxigraph(data.dataFiles); // Exécuté uniquement côté navigateur

    const personNode: NamedNode = namedNode("https://nka11.github.io/#me")
    variantNode = namedNode(data.metadata);
    console.log(variantNode);
    person = getPerson(personNode,'fr',variantNode);

  });
</script>

<article class="prose max-w-none">
  <!-- <p class="text-sm text-gray-500">{new Date(data.metadata.date).toLocaleDateString()}</p> -->
  <!-- <p class="mb-6">{data.metadata.description}</p> -->

  <VariantCv variant={ variantNode } person={ person }></VariantCv>
</article>
