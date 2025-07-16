<script lang="ts">
import { jsPDF } from "jspdf";
    import type { NamedNode } from "oxigraph";
import { generateATS_CV } from "$lib/semcv/pdfprint/ATSCV";
    import type { IPersonDetails } from "$lib/semcv/models";
    import { onMount } from "svelte";
    import { browsingPreferences } from "$lib/state.svelte";
// Default export is a4 paper, portrait, using millimeters for units
const doc = new jsPDF();
let params:{ 
    personNode:NamedNode,
    variant?: NamedNode
} = $props();


doc.text("Hello world!", 10, 10);

function savePdf() {
    const cv: jsPDF = generateATS_CV(
        params.personNode,
        browsingPreferences.lang,
        params.variant
    );
    //TODO POPUP to choose name
    //NICE : show PDF in new tab without download
    cv.save()
}

    onMount(async () => {
    })

</script>

<button onclick={savePdf}>Print PDF</button>