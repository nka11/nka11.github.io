<script lang="ts">
    import { listPersonLangs } from "$lib/semcv/adapters/langsAdapters";
    import type { IPersonLangDetails } from "$lib/semcv/models";
    import type { NamedNode } from "oxigraph";
    import { onMount } from "svelte";

    export let person:NamedNode;
    let languages: IPersonLangDetails[] = [];
    let savedLang: string = 'en';
    onMount(async () => {
        const stored = localStorage.getItem('lang');
        if (stored) savedLang = stored;
        languages = listPersonLangs(person, savedLang);
        console.log(languages)
    });

</script>
<ul>
    {#each languages as language}
        <li>{ language.lang?.value } - { language.level?.value }</li>
    {/each}
</ul>