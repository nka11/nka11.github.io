
<script lang="ts">
  import type { IOrganizationRole } from "$lib/semcv/models";
  import { onMount } from "svelte";
  import OrganizationRole from "./OrganizationRole.svelte";
  import { listOrgRoles } from "$lib/semcv/adapters/experienceAdapter";
  import type { NamedNode } from "oxigraph";
  import { compareExperience } from "$lib/semcv/semantic_cv_store";
  import { browsingPreferences } from "$lib/state.svelte";
  import { _ } from 'svelte-i18n';

  let params:{
    person:NamedNode
    lang?:string
  } = $props();

  let organizationRoles: IOrganizationRole[] = $state([]);
  onMount(async () => {
    organizationRoles = listOrgRoles(params.person,"schema:hasOccupation", params.lang ? params.lang : browsingPreferences.lang ).sort(compareExperience);
  })
</script> 
{#if organizationRoles}
  <h2 class="text-3xl">Experiences</h2>
  {#each organizationRoles as orgrole}
    <OrganizationRole organizationRole={orgrole}/>
  {/each}
{/if}