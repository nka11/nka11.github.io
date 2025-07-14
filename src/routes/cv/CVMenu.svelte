<script lang="ts">
  import PdfPrint from "$lib/components/schemaorgcv/PDF_print.svelte";
  import type { IPersonDetails } from "$lib/semcv/models";
  import { locale, _ } from 'svelte-i18n';
  
  let data: {
    person: IPersonDetails,
    variants: {variant:string, name: string}[]
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
  };
</script>

<PdfPrint personDetails={ data.person as IPersonDetails }></PdfPrint>
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