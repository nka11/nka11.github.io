<script lang="ts">
    import { listPersonLangs } from "$lib/semcv/adapters/langsAdapters";
    import type { IPersonLangDetails } from "$lib/semcv/models";
    import type { NamedNode } from "oxigraph";
    import { onMount } from "svelte";
  	import { browsingPreferences } from '$lib/state.svelte.js';

    export let person:NamedNode;
    let languages: IPersonLangDetails[] = [];
    onMount(async () => {
        languages = listPersonLangs(person, browsingPreferences.lang);
        console.log(languages)
    });

</script>
<ul>
    {#each languages as language}
        <li>{ language.lang?.value } - { language.level?.value }</li>
    {/each}
</ul>