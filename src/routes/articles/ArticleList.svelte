<script lang="ts">
  export let articles: {
    title: string;
    date: string;
    description: string;
    slug: string;
  }[];
  console.log(articles);
</script>

<div class="space-y-6">
  {#each articles as article}
    <a href={`/articles/${article.slug}`} class="block p-4 border rounded hover:shadow transition">
      <h2 class="text-xl font-semibold">{article.title}</h2>
      <p class="text-gray-500 text-sm">{new Date(article.date).toLocaleDateString()}</p>
      <p class="mt-1 text-gray-700">{article.description}</p>
    </a>
  {/each}
</div>
