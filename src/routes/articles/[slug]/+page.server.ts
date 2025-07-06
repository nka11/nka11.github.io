export const prerender = true;

export async function entries() {
  const modules = import.meta.glob('../../../content/articles/*.md');

  const slugs = await Promise.all(
    Object.values(modules).map(async (resolver) => {
      const mod = await resolver();
      return { slug: mod.metadata.slug };
    })
  );

  return slugs;
}

export async function load({ params }) {
  const modules = import.meta.glob('../../../content/articles/*.md');

  for (const resolver of Object.values(modules)) {
    const mod = await resolver();
    const metadata = mod.metadata;

    if (metadata.slug === params.slug) {
      return {
        metadata, // ✅ uniquement des données sérialisables
        slug: metadata.slug // pour construire le path d’import dynamique
      };
    }
  }

  throw error(404, 'Article not found');
}
