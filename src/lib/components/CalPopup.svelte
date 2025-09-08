<!--
@component
A Svelte component to embed Cal.com scheduling links.
It wraps the Cal.com embed.js script and provides different embed types (inline, floating button).
It handles the initialization and API calls to the Cal.com script based on the provided props.

@param { 'inline' | 'floatingButton' | null } [embedType=null] - The type of Cal.com embed. Use 'inline' to embed directly in a div, 'floatingButton' for a popup button, or null for element-click (handled by CalLink.svelte).
@param { string } [namespace='15min'] - The namespace for the Cal.com embed instance. Useful if you have multiple embeds on the page.
@param { string } calLink - The Cal.com scheduling link (e.g., 'your-username/event-type'). Required for the embed to function.
@param { Record<string, any> } [config={ layout: 'month_view' }] - Configuration options for the Cal.com embed.
@param { Record<string, any> | null } [ui={ hideEventTypeDetails: false, layout: 'month_view' }] - UI customization options for the Cal.com embed.
@param { string } [origin='https://cal.com'] - The origin URL for the Cal.com embed.
@param { string } [class=''] - CSS class to apply to the container element (for inline type).
-->
<script lang="ts">
    import { initNamespace, callNamespaceMethod } from '$lib/cal.js';
    import { onMount } from 'svelte';

    let {
        embedType = null as 'inline' | 'floatingButton' | null,
        namespace = '15min',
        calLink = '',
        config = { layout: 'month_view' },
        ui = { hideEventTypeDetails: true, layout: 'month_view' } as Record<string, any> | null,
        origin = 'https://cal.com',
        class: className = ''
    } = $props();

    // Generate a unique ID for the inline container based on the namespace
    // This assumes namespaces are unique if multiple inline embeds are on the page.
    let divId: string = $derived(`cal-inline-container-${namespace}`);

    let embedType_param = $state(embedType);

    function createCalModal(id: string): HTMLElement {
        // Overlay
        const overlay = document.createElement('div');
        overlay.id = `${id}-overlay`;
        overlay.className =
            "my-modal-overlay";

        // Modal inner container
        const inner = document.createElement('div');
        inner.id = id;
        inner.className =
            "my-modal-content";

        // Append
        overlay.appendChild(inner);
        document.body.appendChild(overlay);

        return inner;
    }

    onMount(() => {
        
        let ui_param = ui;
        let hash = window.location.hash;
        if (hash == "#book-a-meeting") {
            console.log(hash);
            ui_param = { hideEventTypeDetails: true, layout: 'month_view' };
            embedType_param = "inline";
            console.log(calLink)
        }
        // Initialize the namespace (idempotent thanks to changes in cal.js)
        initNamespace(namespace, { origin });

        if (embedType_param === 'inline') {
            // Ensure the div is actually in the DOM before trying to use it.
            // Svelte's rendering is synchronous with effect execution unless using $effect.pre or $effect.layout
            // For $effect, the DOM should be updated.
            // A small delay might be safer if Cal.com's script runs too quickly,
            // but ideally, its queuing handles elements not immediately present.
            // The selector method is generally more robust.
            createCalModal(divId);
            callNamespaceMethod(namespace, 'inline', {
                elementOrSelector: `#${divId}`, // Use the selector string
                config,
                calLink
            });
        } else if (embedType_param === 'floatingButton') {
            callNamespaceMethod(namespace, 'floatingButton', { calLink, config });
        }

        // Configure UI (if ui prop is provided)
        // This will be called after 'inline' or 'floatingButton'
        if (ui_param) {
            callNamespaceMethod(namespace, 'ui', ui_param);
        }
    });
</script>
<!-- 
{#if embedType_param === 'inline'}
  <div
    id={`overlay-${divId}`}
    class={`my-modal-overlay ${className}`}
  >
    <div
        id={divId}
      class="my-modal-content"
    >
    </div>
  </div>
{/if} -->

<style>



</style>