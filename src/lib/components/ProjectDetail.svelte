<script lang="ts">
export let projectDetail = {
    credentialName: null,
    projectName: null,
    projectDesc: null
  };

</script>

<p typeof="schema:Project">
  <span class="font-bold">
    <span property="schema:name">{projectDetail.projectName.value}</span> :
  </span>
  <span property="schema:descrition">
    { projectDetail.projectDesc.value }
  </span>
</p>