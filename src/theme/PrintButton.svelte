<script lang="ts">
  import { generateATS_CV } from '$lib/semcv/pdfprint/ATSCV';
  import { generateATS_CV_Typst } from '$lib/semcv/pdfprint/ATSCV_typst';
  import PrintIcon from './icons/Print.svelte';
  import { onMount } from 'svelte';

  let pdfEngine: 'jspdf' | 'typst' = $state('typst');
  let loading = $state(false);
  let isCvPage = $state(false);

  onMount(() => {
    isCvPage = window.document.location.pathname.startsWith('/cv');
  });

  async function printPage() {
    if (isCvPage) {
      if (pdfEngine === 'typst') {
        loading = true;
        try {
          const pdfBytes = await generateATS_CV_Typst();
          const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'cv.pdf';
          a.click();
          URL.revokeObjectURL(url);
        } catch (e) {
          console.error('Typst PDF generation failed:', e);
        } finally {
          loading = false;
        }
      } else {
        const cv = generateATS_CV();
        cv.save();
      }
      return;
    }
    window.print();
  }
</script>

<div class="print-controls">
  {#if isCvPage}
    <select bind:value={pdfEngine} title="PDF engine">
      <option value="typst">Typst</option>
      <option value="jspdf">jsPDF</option>
    </select>
  {/if}
  <button onclick={printPage} title="Print" disabled={loading}>
    {#if loading}
      <span class="spinner"></span>
    {:else}
      <PrintIcon />
    {/if}
  </button>
</div>

<style>
  .print-controls {
    display: flex;
    gap: 0.3rem;
    align-items: center;
  }
  select {
    padding: 0.1rem 0.3rem;
    border: 1px solid var(--text-color, #333);
    border-radius: 3px;
    background: inherit;
    color: inherit;
    font-size: 0.75rem;
  }
  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-color);
  }
  button:disabled {
    opacity: 0.6;
    cursor: wait;
  }
  .spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
