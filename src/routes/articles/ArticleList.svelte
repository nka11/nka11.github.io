<script lang="ts">
  export let articles: {
    title: string;
    date: string;
    description: string;
    slug: string;
    image?: string;
  }[];
  console.log(articles);
</script>

<style>
  .article-link:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
</style>

<div style="display: flex; flex-direction: column; gap: 1.5rem;">
  {#each articles as article}
    <a href={`/articles/${article.slug}`} class="article-link" style="display: block; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.375rem; text-decoration: none; color: inherit; transition: box-shadow 0.15s ease-in-out;">
      <div style="display: flex; gap: 1rem;">
        {#if article.image}
          <div style="flex-shrink: 0; height: 6.25rem; width: 4.5rem;">
            <img src={article.image} alt={article.title} style="height: 100%; width: 100%; object-fit: cover; border-radius: 0.375rem;" />
          </div>
        {/if}
        <div style="flex: 1;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin: 0;">{article.title}</h2>
          <p style="color: #6b7280; font-size: 0.875rem; margin: 0;">{new Date(article.date).toLocaleDateString()}</p>
          <p style="margin-top: 0.25rem; margin-bottom: 0; color: #374151;">{article.description}</p>
        </div>
      </div>
    </a>
  {/each}
</div>
