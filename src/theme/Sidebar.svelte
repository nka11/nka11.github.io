<script>
  // This will be filled in later steps
</script>

<aside class="sidebar">
  <nav class="sidebar-nav">
    <!-- Navigation links will go here -->
  </nav>
</aside>

<style>
  .sidebar {
    position: fixed;
    top: var(--nav-height);
    left: 0;
    bottom: 0;
    width: var(--sidebar-width);
    background-color: var(--c-bg);
    border-right: 1px solid #eaecef;
    padding: 2rem 1.5rem;
    overflow-y: auto;
  }

  .dark .sidebar {
    background-color: var(--c-bg-dark);
    border-right: 1px solid #333;
  }

  @media (max-width: 768px) {
    .sidebar {
      display: none;
    }
  }
</style>
