<script lang="ts">
    import type { NamedNode } from "oxigraph";
    import { generateATS_CV } from "$lib/semcv/pdfprint/ATSCV";
    import { generateATS_CV_Typst } from "$lib/semcv/pdfprint/ATSCV_typst";
    import { browsingPreferences } from "$lib/state.svelte";

    let params: {
        personNode: NamedNode,
        variant?: NamedNode
    } = $props();

    let pdfEngine: 'jspdf' | 'typst' = $state('typst');
    let loading = $state(false);

    async function savePdf() {
        if (pdfEngine === 'typst') {
            loading = true;
            try {
                const pdfBytes = await generateATS_CV_Typst(
                    params.personNode,
                    browsingPreferences.lang,
                    params.variant
                );
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
            const cv = generateATS_CV(
                params.personNode,
                browsingPreferences.lang,
                params.variant
            );
            cv.save();
        }
    }
</script>

<div class="pdf-controls">
    <!-- <select bind:value={pdfEngine}>
        <option value="typst">Typst</option>
        <option value="jspdf">jsPDF</option>
    </select> -->
    <button onclick={savePdf} disabled={loading}>
        {#if loading}
            Generating...
        {:else}
            Print PDF
        {/if}
    </button>
</div>

<style>
    .pdf-controls {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }
    select {
        padding: 0.25rem 0.5rem;
        border: 1px solid var(--text-color, #333);
        border-radius: 4px;
        background: inherit;
        color: inherit;
        font-size: 0.85rem;
    }
    button:disabled {
        opacity: 0.6;
        cursor: wait;
    }
</style>
