<script lang="ts">
    import type { IProjectCycle } from "$lib/semcv/models";

  // === Données extraites du fichier TTL ===
  const props: {
    phases: IProjectCycle | undefined,
  } = $props()

</script>

{#if props.phases}
    <div class="timeline">
      <div class="phase">
        <div class="phase-name">Design</div>
        <div class="phase-role">{props.phases?.design?.value}</div>
      </div>
      <div class="phase">
        <div class="phase-name">Code</div>
        <div class="phase-role">{props.phases?.code?.value}</div>
      </div>
      <div class="phase">
        <div class="phase-name">Build</div>
        <div class="phase-role">{props.phases?.build?.value}</div>
      </div>
      <div class="phase">
        <div class="phase-name">Delivery</div>
        <div class="phase-role">{props.phases?.delivery?.value}</div>
      </div>
      <div class="phase">
        <div class="phase-name">Observability</div>
        <div class="phase-role">{props.phases?.observability?.value}</div>
      </div>
      <div class="phase">
        <div class="phase-name">Run</div>
        <div class="phase-role">{props.phases?.run?.value}</div>
      </div>

    </div>
  {/if}

  <style>
  .timeline {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0.2rem;
    text-align: center;
    margin-top: 1rem;
  }

  .phase {
    background-color: #f9f9f9;
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid #ddd;
    transition: box-shadow 0.2s ease;
  }

  .phase:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  }

  .phase-name {
    font-weight: bold;
    color: #0053a6;
    margin-bottom: 0.25rem;
  }

  .phase-role {
    font-size: 0.85rem;
    color: #777;
    font-style: italic;
  }
  </style>
