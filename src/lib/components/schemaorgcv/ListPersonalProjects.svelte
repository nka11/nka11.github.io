<script lang="ts">
    import { listProjects } from "$lib/semcv/adapters/projectsAdapter";
    import type { IPersonDetails, IProjectDetail } from "$lib/semcv/models";
    import { onMount } from "svelte";
    import ProjectDetail from "./ProjectDetail.svelte";


export let person: IPersonDetails;
let projects:IProjectDetail[] = [];
let savedLang: string = 'en';
onMount(async () => {
    const stored = localStorage.getItem('lang');
    if (stored) savedLang = stored;
    projects = listProjects(person.person, "schema:producer",savedLang);
})
</script>

<div class="">
    {#each projects as project}
        <ProjectDetail projectDetail={project}></ProjectDetail>
    {/each}
</div>