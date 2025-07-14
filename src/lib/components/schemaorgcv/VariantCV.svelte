<script lang="ts">
  import type { IPersonDetails, IVariantsDetails } from "$lib/semcv/models";
    import type { NamedNode } from "oxigraph";
  	import { browsingPreferences } from '$lib/state.svelte.js';
    import Experiences from "./Experiences.svelte";
    import { onMount } from "svelte";
    import { getPerson } from "$lib/semcv/adapters/personAdapters";
    import { initOxigraph } from "$lib/semcv/semantic_cv_store";
  let params:{
    variant: NamedNode,
    person: NamedNode,
    lang?:string
  } = $props()
  let personDetails:IPersonDetails | undefined = $state();
  onMount(async () => {
      // await initOxigraph(data.dataFiles); // Exécuté uniquement côté navigateur

    // const personNode: NamedNode = namedNode("https://nka11.github.io/#me")
    // variantNode = namedNode(data.metadata);
    // console.log(variantNode);
    personDetails = getPerson(params.person,browsingPreferences.lang,params.variant);

  });
</script>

{#if personDetails}
  <h2>
    { personDetails.jobTitle?.value }
  </h2>
  <p 
  class="whitespace-pre-line">
    { personDetails.description?.value }
  </p>
  <Experiences person={personDetails.person} lang={ browsingPreferences.lang }></Experiences>
{/if}