<script lang="ts">
  import PdfPrint from "$lib/components/schemaorgcv/PDF_print.svelte";
  import type { IPersonDetails } from "$lib/semcv/models";
  import { locale, _ } from 'svelte-i18n';
  import { browsingPreferences } from "$lib/state.svelte";
    import type { NamedNode } from "oxigraph";
  let data: {
    person: NamedNode,
    variants?: {variant:string, name: string}[] | undefined
  } = $props()

  function selectVariant(event:Event) {
    const target = event.target as HTMLSelectElement;
    document.location = `${document.location.toString().replace(/\:$/, '')}/${target.value}`;
  }

  export const changeLang = (lang: string) => {
    locale.set(lang);
    // loadCVData(lang);
    // savedLang = lang;
    localStorage.setItem('lang', lang);
    browsingPreferences.lang = lang
  };
</script>

<button onclick={() => changeLang('fr')}>FR</button>
<button onclick={() => changeLang('en')}>EN</button>


<PdfPrint personNode={ data.person }></PdfPrint>
{#if data.variants}
  {#if data.variants.length > 0}
  <select onchange={selectVariant}>
      <option selected>
      CV générique
      </option>

      {#each data.variants as variant }
      <option value={ variant.variant }>{ variant.name }</option>
      {/each}
  </select>
  {/if}
{:else}
  <a href="/cv">CV Générique</a>

{/if}