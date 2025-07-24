<script lang="ts">
    import { setupI18n, locale } from '$lib/i18n';
    import { browsingPreferences } from '$lib/state.svelte';

    setupI18n();

    $effect(() => {
        locale.set(browsingPreferences.lang);
    });

    const { children } = $props()
</script>

{@render children?.()}
