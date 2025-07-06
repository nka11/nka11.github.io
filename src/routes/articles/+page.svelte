<script lang="ts">
  import ArticleList from './ArticleList.svelte';
  export let data;
</script>

<ArticleList articles={data.articles} />
