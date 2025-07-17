<script>
  import GlobalLayout from '../theme/GlobalLayout.svelte'
  const { children } = $props()
</script>

<GlobalLayout>
  {@render children?.()}
</GlobalLayout>
