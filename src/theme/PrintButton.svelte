<script lang="ts">
  import { generateATS_CV_Typst } from '$lib/semcv/pdfprint/ATSCV_typst';
  import { VARIANT_PREFIX } from '$lib/semcv/adapters/variantsAdapter';
  import { namedNode } from 'oxigraph';
  import PrintIcon from './icons/Print.svelte';
  import { onMount } from 'svelte';

  let loading = $state(false);
  let isCvPage = $state(false);

  onMount(() => {
    isCvPage = window.document.location.pathname.startsWith('/cv');
  });

  function getVariantFromUrl() {
    const match = window.location.pathname.match(/^\/cv\/(.+?)(?:\/)?$/);
    if (match) {
      return namedNode(VARIANT_PREFIX + match[1]);
    }
    return undefined;
  }

  async function printPage() {
    if (isCvPage) {
      const variant = getVariantFromUrl();
      loading = true;
      try {
        const pdfBytes = await generateATS_CV_Typst(undefined, undefined, variant);
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
      return;
    }
    window.print();
  }
</script>

<button onclick={printPage} title="Print" disabled={loading}>
  {#if loading}
    <span class="spinner"></span>
  {:else}
    <PrintIcon />
  {/if}
</button>

<style>
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
