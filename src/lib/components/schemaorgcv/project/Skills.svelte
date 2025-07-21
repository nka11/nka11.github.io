<script lang="ts">
  const props: {
    skills: { [key: string]: string[] }
  } = $props()

</script>

<div class="skills-section">
    <h3>Skills Used</h3>
    <div class="skills-grid">
      {#each Object.entries(props.skills) as [category, list]}
        <div class="skill-box">
          {#if category != "undefined"}
            <div class="skill-category">{category}</div>
          {/if}
          {#each list as skill}
            <span class="skill-tag">{skill}</span>
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
.skills-section {
    /* border: 1px solid #ddd;
    border-radius: 0.5rem; */
    margin-top: 0.5rem;

  }
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(2rem, 1fr));
    gap: 0.5rem;
    /* margin-top: 0.5rem; */
  }

  .skill-box {
    background-color: #f8f8f8;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    padding: 0.5rem;
  }

  .skill-category {
    font-size: 0.9rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    color: #444;
  }

  .skill-tag {
    display: inline-block;
    background-color: #d1f1d1;
    color: #176b34;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    margin: 0.25rem 0.4rem 0.4rem 0;
  }
  </style>
