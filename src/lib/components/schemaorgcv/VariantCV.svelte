<script lang="ts">
  import type { IPersonDetails, IVariantsDetails } from "$lib/semcv/models";
    import type { NamedNode } from "oxigraph";

  let data:{
    variant: NamedNode,
    person: IPersonDetails
  } = $props()

</script>

{#if data.person}
  <h2>
    { data.person.jobTitle?.value }
  </h2>
  <p 
  class="whitespace-pre-line">
    { data.person.description?.value }
  </p>
{/if}