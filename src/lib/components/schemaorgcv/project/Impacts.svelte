<script lang="ts">
const props = $props<{
    impacts: {
        Organizational: string[],
        Technical: string[],
        Data: string[],
        User: string[]
    }
}>()
</script>
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
