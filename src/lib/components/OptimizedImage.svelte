<script lang="ts">
  import { onMount } from 'svelte';

  interface OptimizedImageProps {
    src: string;
    alt: string;
    sizes?: string;
    loading?: 'lazy' | 'eager';
    priority?: boolean;
    aspectRatio?: string;
    placeholder?: 'blur' | 'skeleton' | 'none';
    class?: string;
  }

  let {
    src,
    alt,
    sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    loading = 'lazy',
    priority = false,
    aspectRatio,
    placeholder = 'blur',
    class: className = ''
  }: OptimizedImageProps = $props();

  // Reactive state using Svelte 5 runes
  let isLoaded = $state(false);
  let isIntersecting = $state(false);
  let hasError = $state(false);
  let imageElement: HTMLImageElement | undefined = $state();
  let containerElement: HTMLDivElement | undefined = $state();

  // Derived values using Svelte 5 runes
  let shouldLoadImage = $derived(priority || isIntersecting);
  let showPlaceholder = $derived(!isLoaded && placeholder !== 'none');

  // Image manifest lookup (will be populated from manifest.json)
  let imageManifest = $state<any>({});

  // Get optimized image data from manifest
  let imageData = $derived(() => {
    const relativePath = src.replace(/^\//, '').replace(/^static\//, '');
    return imageManifest[relativePath];
  });

  // Generate srcset for different formats and sizes
  let avifSrcset = $derived(() => {
    if (!imageData()) return '';
    const formats = imageData().formats?.avif;
    if (!formats) return '';

    return Object.entries(formats)
      .map(([width, url]) => `${url} ${width}w`)
      .join(', ');
  });

  let webpSrcset = $derived(() => {
    if (!imageData()) return '';
    const formats = imageData().formats?.webp;
    if (!formats) return '';

    return Object.entries(formats)
      .map(([width, url]) => `${url} ${width}w`)
      .join(', ');
  });

  let fallbackSrcset = $derived(() => {
    if (!imageData()) return '';
    const formats = imageData().formats?.original;
    if (!formats) return '';

    return Object.entries(formats)
      .map(([width, url]) => `${url} ${width}w`)
      .join(', ');
  });

  let placeholderSrc = $derived(() => {
    return imageData()?.placeholder || '';
  });

  let computedAspectRatio = $derived(() => {
    return aspectRatio || imageData()?.aspectRatio || 'auto';
  });

  // Intersection Observer for lazy loading
  let observer: IntersectionObserver | undefined;

  onMount(async () => {
    // Load image manifest
    try {
      const response = await fetch('/images-optimized/manifest.json');
      if (response.ok) {
        imageManifest = await response.json();
      }
    } catch (error) {
      console.warn('Could not load image manifest:', error);
    }

    // Setup intersection observer for lazy loading
    if (loading === 'lazy' && !priority && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              isIntersecting = true;
              observer?.disconnect();
            }
          });
        },
        {
          rootMargin: '100px',
        }
      );

      if (containerElement) {
        observer.observe(containerElement);
      }
    } else {
      // Load immediately if not lazy loading
      isIntersecting = true;
    }

    return () => {
      observer?.disconnect();
    };
  });

  function handleImageLoad() {
    isLoaded = true;
    hasError = false;
  }

  function handleImageError() {
    hasError = true;
    console.warn(`Failed to load optimized image: ${src}`);
  }

  // Preload critical images
  $effect(() => {
    if (priority && imageData() && typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';

      // Preload AVIF if available, otherwise WebP, otherwise original
      if (avifSrcset()) {
        link.href = Object.values(imageData().formats.avif)[0] as string;
        link.type = 'image/avif';
      } else if (webpSrcset()) {
        link.href = Object.values(imageData().formats.webp)[0] as string;
        link.type = 'image/webp';
      } else if (fallbackSrcset()) {
        link.href = Object.values(imageData().formats.original)[0] as string;
      }

      if (link.href) {
        document.head.appendChild(link);
      }
    }
  });
</script>

<div
  bind:this={containerElement}
  class="optimized-image-container {className}"
  style="aspect-ratio: {computedAspectRatio};"
>
  {#if showPlaceholder && placeholder === 'blur' && placeholderSrc()}
    <img
      src={placeholderSrc()}
      alt=""
      class="placeholder-image"
      aria-hidden="true"
    />
  {/if}

  {#if showPlaceholder && placeholder === 'skeleton'}
    <div class="skeleton-placeholder" aria-hidden="true"></div>
  {/if}

  {#if shouldLoadImage && imageData()}
    <picture>
      {#if avifSrcset()}
        <source
          srcset={avifSrcset()}
          sizes={sizes}
          type="image/avif"
        />
      {/if}

      {#if webpSrcset()}
        <source
          srcset={webpSrcset()}
          sizes={sizes}
          type="image/webp"
        />
      {/if}

      <img
        bind:this={imageElement}
        src={fallbackSrcset() ? Object.values(imageData().formats.original)[0] as string : src}
        srcset={fallbackSrcset() || ''}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        class="main-image"
        class:loaded={isLoaded}
        class:error={hasError}
        onload={handleImageLoad}
        onerror={handleImageError}
      />
    </picture>
  {:else if !shouldLoadImage}
    <!-- Placeholder while waiting for intersection -->
    <div class="loading-placeholder" aria-hidden="true"></div>
  {:else}
    <!-- Fallback if no optimized version available -->
    <img
      bind:this={imageElement}
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      class="main-image fallback"
      class:loaded={isLoaded}
      class:error={hasError}
      onload={handleImageLoad}
      onerror={handleImageError}
    />
  {/if}
</div>

<style>
  .optimized-image-container {
    position: relative;
    width: 100%;
    overflow: hidden;
    background-color: #f5f5f5;
  }

  .main-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: opacity 0.3s ease;
    opacity: 0;
  }

  .main-image.loaded {
    opacity: 1;
  }

  .main-image.error {
    opacity: 0.5;
    filter: grayscale(100%);
  }

  .main-image.fallback {
    border: 2px dashed #ccc;
  }

  .placeholder-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    filter: blur(10px);
    transform: scale(1.1);
    opacity: 0.8;
    z-index: 1;
  }

  .skeleton-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
    z-index: 1;
  }

  .loading-placeholder {
    width: 100%;
    height: 100%;
    background-color: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .loading-placeholder::after {
    content: '📷';
    font-size: 2rem;
    opacity: 0.3;
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  /* Hide placeholder when main image is loaded */
  .optimized-image-container:has(.main-image.loaded) .placeholder-image,
  .optimized-image-container:has(.main-image.loaded) .skeleton-placeholder {
    opacity: 0;
    transition: opacity 0.3s ease;
  }
</style>