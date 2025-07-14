<script lang="ts">
import { jsPDF } from "jspdf";
    import type { NamedNode } from "oxigraph";
import { generateATS_CV } from "$lib/semcv/pdfprint/ATSCV";
    import type { IPersonDetails } from "$lib/semcv/models";
    import { onMount } from "svelte";
// Default export is a4 paper, portrait, using millimeters for units
const doc = new jsPDF();
export let personNode:NamedNode;
let savedLang: string = 'en';


doc.text("Hello world!", 10, 10);

function savePdf() {
    const cv: jsPDF = generateATS_CV(personNode,savedLang);
    cv.save()
}

    onMount(async () => {
      const stored = localStorage.getItem('lang');
      if (stored) savedLang = stored;
    })

</script>

<button on:click={savePdf}>Print PDF</button>