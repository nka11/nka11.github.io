<script lang="ts">
  import type { ISkillsDetails } from '$lib/semcv/models';
  import { onMount } from 'svelte';
  export let skills: ISkillsDetails[] = [];
  onMount(async () => {
      
      
  });
</script>

{#if skills.length > 0}
  <div class="text-xs">
    <span class="font-bold"></span>
    {#each skills as skill }
      [ <span class="border border-solid border-1 m-1">{skill.skillLabel?.value}</span> ]
      
    {/each}
  </div>
{/if}
