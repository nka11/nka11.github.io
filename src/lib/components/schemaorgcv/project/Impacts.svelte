<script lang="ts">
    import type { IProjectImpact } from "$lib/semcv/models";
    import { onMount } from "svelte";

const props = $props<{
    impacts?: any
}>()
console.log("Impacts")
// console.log($inspect(props.impacts))

</script>
{#if Object.entries(props.impacts).length > 0 }
  
  <div class="impacts-section">
    <h3>Project Impacts</h3>
    <div class="impacts-grid">
      {#each Object.entries(props.impacts) as [category, items]}
        <div class="impact-box">
          <div class="impact-category">{category}</div>
          {#each items as item}
            <div class="badge">{item}</div>
          {/each}
        </div>
      {/each}
    </div>
  </div>
{/if }

  <style>
    h3 {
    font-size: 1.1rem;
    margin-top: 0rem;
    margin-bottom: 0.2rem;
    font-weight: bold;
    color: #222;
  }
  .impacts-section {
    /* border: 1px solid #ddd;
    border-radius: 0.5rem; */
    margin-top: 0.5rem;

  }
  .impacts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.5rem;
    /* margin-top: 1rem; */
  }

  .impact-box {
    background-color: #f4f4f4;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    padding: 0.5rem;
  }

  .impact-category {
    font-size: 0.9rem;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
    color: #444;
  }

  .badge {
    display: inline-block;
    background-color: #e0f0ff;
    color: #0053a6;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    margin: 0.25rem 0.4rem 0.4rem 0;
  }
  </style>
