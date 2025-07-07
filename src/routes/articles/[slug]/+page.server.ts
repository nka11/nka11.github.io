export const prerender = true;

export async function entries() {
  const modules = import.meta.glob('../../../content/articles/*.md');

  const slugs = await Promise.all(
    Object.values(modules).map(async (resolver) => {
      const mod:any = await resolver();
      return { slug: mod.metadata.slug };
    })
  );

  return slugs;
}

export async function load({ params }: any) {
  const modules = import.meta.glob('../../../content/articles/*.md');

  for (const resolver of Object.values(modules)) {
    const mod: any = await resolver();
    const metadata = mod.metadata;

    if (metadata.slug === params.slug) {
      return {
        metadata, // ✅ uniquement des données sérialisables
        slug: metadata.slug // pour construire le path d’import dynamique
      };
    }
  }

  throw 'Article not found';
}
