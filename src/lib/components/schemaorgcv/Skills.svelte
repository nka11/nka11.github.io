<script lang="ts">
  import type { ISkillsDetails } from '$lib/semcv/models';
  import Skill from './Skilll.svelte';
  export let skills: ISkillsDetails[] = [];
</script>

{#if skills.length > 0}
  <div class="flex flex-wrap">
    {#each skills as skill}
      <Skill {skill} />
    {/each}
  </div>
{/if}
