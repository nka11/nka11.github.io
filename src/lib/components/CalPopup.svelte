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

// import { initNamespace, callNamespaceMethod } from "$lib/cal.js";

/**
 * Ouvre une modal avec un Cal.com inline embed
 * @param calLink string - lien Cal.com (ex: 'username/event-type')
 * @param config object - config pour Cal.com
 * @param ui object|null - options UI pour Cal.com
 * @param namespace string - namespace Cal.com
 * @param origin string - URL de Cal.com (default: 'https://cal.com')
 * @returns () => void - fonction pour fermer la modal
 */
function openCalModal({
  calLink,
  config = { layout: "month_view" },
  ui = null,
  namespace = "15min",
  origin = "https://cal.com",
}: {
  calLink: string;
  config?: Record<string, any>;
  ui?: Record<string, any> | null;
  namespace?: string;
  origin?: string;
}) {
  // Overlay modal
  const overlay = document.createElement("div");
  Object.assign(overlay.style, {
    position: "fixed",
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",
    zIndex: "2147483647",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    overflowY: "auto",
    padding: "2rem 1rem",
  });

  // Modal content
  const modal = document.createElement("div");
  Object.assign(modal.style, {
    position: "relative",
    backgroundColor: "#ffffff",
    borderRadius: "1rem",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
    padding: "1.5rem",
    width: "auto",
    maxWidth: "80%",
    maxHeight: "90vh",
    overflowY: "auto",
  });

  // Close button
  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = "&times;";
  Object.assign(closeBtn.style, {
    position: "absolute",
    top: "0.5rem",
    right: "0.75rem",
    background: "transparent",
    border: "none",
    fontSize: "2rem",
    lineHeight: "1",
    cursor: "pointer",
    color: "#555",
    zIndex: 123,
  });
  closeBtn.onmouseover = () => (closeBtn.style.color = "#000");
  closeBtn.onmouseout = () => (closeBtn.style.color = "#555");
  closeBtn.onclick = () => document.body.removeChild(overlay);
  modal.prepend(closeBtn);

  // Div pour Cal.com embed
  const calDiv = document.createElement("div");
  calDiv.id = `cal-inline-${namespace}`;
  modal.appendChild(calDiv);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Initialisation Cal.com
  initNamespace(namespace, { origin });
  callNamespaceMethod(namespace, "inline", {
    elementOrSelector: `#${calDiv.id}`,
    calLink,
    config,
  });

  if (ui) {
    callNamespaceMethod(namespace, "ui", ui);
  }

  // Retourne fonction pour fermer modal
  return () => {
    if (overlay.parentNode) document.body.removeChild(overlay);
  };
}


    onMount(() => {
        
        let ui_param = ui;
        let hash = window.location.hash;
        if (hash == "#book-a-meeting") {
            console.log(hash);
            ui_param = { hideEventTypeDetails: true, layout: 'month_view' };
            embedType_param = "inline";
            openCalModal({
                calLink,
                config,
                ui: ui_param,
            });

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
