<script lang="ts">
    import { namedNode, type NamedNode } from "oxigraph";
    import { generateATS_CV_Typst } from "$lib/semcv/pdfprint/ATSCV_typst";
    import { browsingPreferences } from "$lib/state.svelte";
    import { VARIANT_PREFIX } from "$lib/semcv/adapters/variantsAdapter";

    let params: {
        personNode: NamedNode,
        variant?: NamedNode
    } = $props();

    let loading = $state(false);

    function getVariantFromUrl(): NamedNode | undefined {
        const pathname = window.location.pathname;
        const match = pathname.match(/^\/cv\/(.+?)(?:\/)?$/);
        if (match) {
            return namedNode(VARIANT_PREFIX + match[1]);
        }
        return undefined;
    }

    async function savePdf() {
        loading = true;
        try {
            const variant = getVariantFromUrl() ?? params.variant;
            const pdfBytes = await generateATS_CV_Typst(
                params.personNode,
                browsingPreferences.lang,
                variant
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
    }
</script>

<div class="pdf-controls">
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
    button:disabled {
        opacity: 0.6;
        cursor: wait;
    }
</style>
