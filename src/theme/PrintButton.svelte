<script lang="ts">
  import { generateATS_CV } from '$lib/semcv/pdfprint/ATSCV';
  import type jsPDF from 'jspdf';
  import PrintIcon from './icons/Print.svelte';

  function printPage() {
    if (window.document.location.pathname.startsWith('/cv')) {
      const cv: jsPDF = generateATS_CV()
      cv.save()
      return;
    } 
    window.print();
  }
</script>

<button on:click={printPage} title="Print">
  <PrintIcon />
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
</style>
