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
  .project-desc {
    font-size: 0.95rem;
    color: #444;
    white-space: pre-line;
    text-align: justify;
    line-height: 1.5;
  }
</style>
