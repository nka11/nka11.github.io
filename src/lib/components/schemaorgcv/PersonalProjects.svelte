<script lang="ts">
    import { listProjects } from "$lib/semcv/adapters/projectsAdapter";
    import type { IPersonDetails, IProjectDetail } from "$lib/semcv/models";
    import { onMount } from "svelte";
    import ProjectDetail from "./ProjectDetail.svelte";
    import type { NamedNode } from "oxigraph";
    import { browsingPreferences } from '$lib/state.svelte';
    // import type { NamedNode } from "rdflib";


export let person: NamedNode;
let projects:IProjectDetail[] = [];
onMount(async () => {
    projects = listProjects(person, "schema:producer", browsingPreferences.lang);
})
</script>

<div class="">
    {#each projects as project}
        <ProjectDetail projectDetail={project}></ProjectDetail>
    {/each}
</div>