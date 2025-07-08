<script lang="ts">

    
  export let data: any;
  //console.log(data);
  const jsonLD = JSON.stringify(data.jsonld);
  const ldString = `<script type=\"application/ld+json\">${jsonLD}\u003C/script>`;
</script>

{@html ldString}
<p></p>
