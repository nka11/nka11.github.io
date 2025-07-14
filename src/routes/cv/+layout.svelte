<script lang="ts">
  import { locale, _ } from 'svelte-i18n';

  const { children } = $props()
  import { onMount } from 'svelte';
  import { initOxigraph, oxigraphStore } from '$lib/semcv/semantic_cv_store';
  import { get } from 'svelte/store';
  
  onMount(async () =>  {
    
    
    //const store = instance;
    // await init(wasmUrl);; // charge le module WebAssembly
    
    //const store = new Store();


  });

  export const changeLang = (lang: string) => {
    locale.set(lang);
    localStorage.setItem('lang', lang);
  };

</script>



<!-- Leave this. Or you can add more content for your custom layout -->
{@render children?.()}
