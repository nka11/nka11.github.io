// +page.server.ts
export async function load() {
  const modules = import.meta.glob('../../content/articles/*.md');

  const articles = await Promise.all(
    Object.entries(modules).map(async ([path, resolver]) => {
      const { metadata }:any = await resolver();
      if (metadata && metadata.date)
        return {
            ...metadata,
            slug: metadata.slug ?? path.split('/').pop()?.replace('.md', '')
        };
    })
  );

  return {
    articles: articles.filter((elem) => {
      return elem && elem.date
    }).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  };
}
