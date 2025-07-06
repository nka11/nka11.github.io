// +page.server.ts
export async function load() {
  const modules = import.meta.glob('../../content/articles/*.md');

  const articles = await Promise.all(
    Object.entries(modules).map(async ([path, resolver]) => {
      const { metadata } = await resolver();
      if (metadata)
        return {
            ...metadata,
            slug: metadata.slug ?? path.split('/').pop()?.replace('.md', '')
        };
    })
  );

  return {
    articles: articles.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  };
}
