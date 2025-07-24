<script>
  import PrintIcon from './icons/Print.svelte';

  function printPage() {
    window.print();
  }
</script>

<button on:click={printPage} title="Print">
  <PrintIcon />
</button>

<style>
  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-color);
  }
</style>
