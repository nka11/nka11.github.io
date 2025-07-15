<script lang="ts">
  import PdfPrint from "$lib/components/schemaorgcv/PDF_print.svelte";
  import type { IPersonDetails, IVariantsDetails } from "$lib/semcv/models";
  import { locale, _ } from 'svelte-i18n';
  import { browsingPreferences } from "$lib/state.svelte";
    import type { NamedNode } from "oxigraph";
    import { onMount } from "svelte";
    import { listVariants, VARIANT_PREFIX } from "$lib/semcv/adapters/variantsAdapter";
  let params: {
    person: NamedNode,
    variants?: IVariantsDetails[] | undefined,
    variant: NamedNode | undefined
  } = $props()
  let variants = $state(params.variants);

  function selectVariant(event:Event) {
    const target = event.target as HTMLSelectElement;
    document.location = target.value;
  }

  export const changeLang = (lang: string) => {
    locale.set(lang);
    // loadCVData(lang);
    // savedLang = lang;
    localStorage.setItem('lang', lang);
    browsingPreferences.lang = lang
  };
  onMount(async () => {
    variants = listVariants(params.person, browsingPreferences.lang)
  });

</script>

<button onclick={() => changeLang('fr')}>FR</button>
<button onclick={() => changeLang('en')}>EN</button>


<PdfPrint personNode={ params.person }></PdfPrint>
{#if variants}
  {#if variants.length > 0}
  <select onchange={selectVariant}>
    {#if params.variant}
      <option value="/cv">
      CV générique
      </option>
      {:else}
      <option selected>
      CV générique
      </option>
    {/if}
      {#each variants as variant }
      {#if params.variant?.value == variant.variant.value}
        <option selected value={ `/cv/${variant.variant.value.slice(VARIANT_PREFIX.length)}` }>{ variant.name }</option>
      {:else}
        <option value={ `/cv/${variant.variant.value.slice(VARIANT_PREFIX.length)}` }>{ variant.name }</option>

      {/if}
      {/each}
  </select>
  {/if}
{:else}
  <a href="/cv">CV Générique</a>

{/if}