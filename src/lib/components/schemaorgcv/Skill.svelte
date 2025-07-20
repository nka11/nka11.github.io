<script lang="ts">
  import type { ISkillsDetails } from '$lib/semcv/models';
  export let skill: ISkillsDetails;
</script>

<style>
  .skill-tag {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 0.5rem;
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    margin: 0.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #333;
    transition: all 0.2s ease-in-out;
  }

  .skill-tag:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
</style>

<div class="skill-tag">
  {skill.skillLabel?.value}
</div>
