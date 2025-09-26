<script lang="ts">
  import { onMount } from 'svelte';
  import { error } from '@sveltejs/kit';
  import ImageInText from '$lib/components/ImageInText.svelte';

  export let data: {
    metadata: {
      image: any;
      title: string;
      date: string;
      description: string;
      slug: string;
    };
    slug: string;
  };

  let ContentComponent: any;

  onMount(async () => {
    const modules = import.meta.glob('../../../content/articles/*.md');
    // const match = Object.entries(modules).find(([path]) =>
    //   path.includes(`${data.slug}.md`)
    // );

    // if (!match) {
    //   throw error(404, 'Markdown not found');
    // }

    //const mod = await match[1]();
    for (const resolver of Object.values(modules)) {
        const mod: any = await resolver();
        const metadata = mod.metadata;

        if (metadata.slug === data.slug) {
          ContentComponent = mod.default;
        }
      }

    
  });
</script>

<article class="prose max-w-none">
  <h1>{data.metadata.title}</h1>
  <p class="text-sm text-gray-500">{new Date(data.metadata.date).toLocaleDateString()}</p>
  <!-- <p class="mb-6">{data.metadata.description}</p> -->
  {#if data.metadata.image}
    <ImageInText src={data.metadata.image} alt={data.metadata.title} />
  {/if}
  {#if ContentComponent}
    <svelte:component this={ContentComponent} />
  {:else}
    <p>Chargement du contenu...</p>
  {/if}
</article>
