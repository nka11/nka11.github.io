<script>
  const { children } = $props()
  import { onMount } from 'svelte';
  import { initOxigraph, oxigraphStore } from '$lib/stores/semantic_cv_store';
  import { get } from 'svelte/store';
  
  onMount(async () =>  {
    await initOxigraph(); // Exécuté uniquement côté navigateur
    const { store, oxiReady } = get(oxigraphStore);
    if (!oxiReady) return;
    
    //const store = instance;
    // await init(wasmUrl);; // charge le module WebAssembly
    
    //const store = new Store();
    

  });
</script>

<!-- Leave this. Or you can add more content for your custom layout -->
{@render children?.()}
