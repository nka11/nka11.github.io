<script lang="ts">
  const { children } = $props()
  import { onMount } from 'svelte';
  import { initOxigraph, oxigraphStore } from '$lib/schemaorgcv/semantic_cv_store';
  import { get } from 'svelte/store';
  
  onMount(async () =>  {
    
    
    //const store = instance;
    // await init(wasmUrl);; // charge le module WebAssembly
    
    //const store = new Store();


  });



</script>

<!-- Leave this. Or you can add more content for your custom layout -->
{@render children?.()}
