<script lang="ts">
  export let src: string;
  export let alt: string;

  let showModal = false;

  function openModal() {
    showModal = true;
  }

  function closeModal() {
    showModal = false;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }

  function handleImageKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openModal();
    }
  }

  function handleModalKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<button
  class="image-button"
  on:click={openModal}
  on:keydown={handleImageKeydown}
  aria-label="Click to view full size image: {alt}"
>
  <div class="image-wrapper">
    <img
      src={src}
      alt={alt}
      class="responsive-image"
    />
  </div>
</button>

{#if showModal}
  <div
    class="modal-overlay"
    on:click={closeModal}
    on:keydown={handleModalKeydown}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <div class="modal-content">
      <img
        src={src}
        alt={alt}
        class="modal-image"
        on:click|stopPropagation
      />
      <button
        class="close-button"
        on:click={closeModal}
        aria-label="Close modal"
      >
        ×
      </button>
    </div>
  </div>
{/if}

<style>
  .image-button {
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
    margin: 0.5em;
    width: 100%;
    height: 15vw;
    overflow: hidden;
  }

  .image-wrapper {
    position: relative;
    z-index: 20;
    width: 100%;
    height: 100%;
    border: 1px solid #404040;
    padding: 8px;
    background-color: white;
    box-sizing: border-box;
  }

  .responsive-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
  }

  .modal-content {
    position: relative;
    max-width: 100%;
    max-height: 100%;
    padding: 1rem;
  }

  .modal-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .close-button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    color: white;
    background-color: rgba(0, 0, 0, 0.5);
    border: none;
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.5rem;
  }

  .close-button:hover {
    background-color: rgba(0, 0, 0, 0.75);
  }

  @media (min-width: 640px) {
    .image-button {
      width: 50%;
      height: auto;
      float: right;
      margin-right: 0.5em;
      z-index: 10;
    }
  }

  @media (min-width: 768px) {
    .image-button {
      width: 50%;
      height: auto;
    }
  }

  @media (min-width: 1024px) {
    .image-button {
      width: 33.333333%;
      height: auto;
    }
  }

  @media (min-width: 1280px) {
    .image-button {
      width: 25%;
      height: auto;
    }
  }
</style>