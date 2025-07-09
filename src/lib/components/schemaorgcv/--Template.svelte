<script lang="ts">
  import { mapToObject, oxigraphStore } from '$lib/schemaorgcv/semantic_cv_store';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  let savedLang: string = 'en';
    onMount(async () => {
      const stored = localStorage.getItem('lang');
      if (stored) savedLang = stored;
      
      const { store, oxiReady } = get(oxigraphStore);
      if (!oxiReady) {
        console.log("Template component onMount: semantic store not ready");
        return;
      }
  });
</script>