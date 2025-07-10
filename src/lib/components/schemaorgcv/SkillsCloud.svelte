<script lang="ts">
    import type { ISkillsCount } from "$lib/semcv/models";

  export let skills: ISkillsCount[];

  // Déterminer les bornes de score
  const minCount = Math.min(...skills.map(t => t.count.value));
  const maxCount = Math.max(...skills.map(t => t.count.value));

  // Fonction de normalisation
  const getFontSize = (count: number) => {
    const minSize = 0.8; // rem
    const maxSize = 2.5; // rem
    if (maxCount === minCount) return `${(minSize + maxSize) / 2}rem`;
    const ratio = (count - minCount) / (maxCount - minCount);
    return `${minSize + ratio * (maxSize - minSize)}rem`;
  };

  const getColor = (count: number) => {
    const hue = 200 - ((count - minCount) / (maxCount - minCount)) * 60;
    return `hsl(${hue}, 70%, 55%)`;
  };
</script>

<style>
  .tagcloud {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
    padding: 1rem;
  }

  .tag {
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    border-radius: 0.375rem;
    padding: 0.25rem 0.5rem;
    font-weight: 500;
  }

  .tag:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
</style>

<div class="tagcloud" aria-label="Tag Cloud">
  {#each skills as { skillName, count }}
    <span
      class="tag"
      style="font-size: {getFontSize(count.value)}; color: {getColor(count.value)};"
      title={`Score: ${count}`}
    >
      {skillName.value}
    </span>
  {/each}
</div>