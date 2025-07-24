<script lang="ts">
    import type { IProjectDetail } from "$lib/semcv/models";

  // === Données extraites du fichier TTL ===
  const props: {
    project: IProjectDetail,
  } = $props()
  const project = props.project;
</script>

<p class="project-desc">
    {@html project.projectDescription?.value}
</p>

<style>
h2 {
    font-size: 1.3rem;
    font-weight: bold;
    margin: 0 0 0 0.25rem;
    border: none;
  }
.subtitle {
    font-size: 0.9rem;
    color: #555;
    margin-bottom: 1rem;
    font-style: italic;
  }

  .project-desc {
    font-size: 1.15rem;
    color: #444;
    white-space: pre-line;
    text-align: justify;
    line-height: 1.5;
  }
</style>
