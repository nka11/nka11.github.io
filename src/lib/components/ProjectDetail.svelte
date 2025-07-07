<script lang="ts">
export let projectDetail = {
    credentialName: null,
    projectName: null,
    projectDescription: null,
    projectStartDate: null,
    projectEndDate: null
  };
  function formatDateFr(dateStr) {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      if (isNaN(date)) return null;
      const day = date.getDate();
      // const dayStr = day === 1 ? "1er" : day;
      const month = date.toLocaleString("fr-FR", { month: "long" });
      const year = date.getFullYear();
      return `${month} ${year}`;
    } catch {
      return dateStr;
    }
  }

</script>

<div 
  class="pt-1 my-0 pb-0"
  typeof="schema:Project">
  <span class="text-sm p-0 m-0">
    <span class="font-bold" property="schema:name">{projectDetail.projectName.value}</span> :
    {#if projectDetail.projectStartDate || projectDetail.projectEndDate}
      
      <span class="text-xs italic">
        <span class="mx-2">—</span>
        {#if projectDetail.projectStartDate && projectDetail.projectEndDate}
          <span class="mx-1">de</span>
        {/if}
        {#if projectDetail.projectStartDate && !projectDetail.projectEndDate}
          <span class="mx-1">depuis</span>
        {/if}
        {#if projectDetail.projectStartDate}
          
          <time
            property="schema:startDate"
            datetime={projectDetail.projectStartDate.value}
            datatype="xsd:date"
            class="italic"
          >
            {formatDateFr(projectDetail.projectStartDate.value)}
          </time>
        {/if}

        {#if projectDetail.projectStartDate && projectDetail.projectEndDate}
          <span class="mx-1">à</span>
        {/if}

        {#if projectDetail.projectEndDate}
          <time
            property="schema:endDate"
            datetime={projectDetail.projectEndDate.value}
            datatype="xsd:date"
            class="italic"
          >
            {formatDateFr(projectDetail.projectEndDate.value)}
          </time>
        
        {/if}
      </span>
    {/if}
  </span>
  {#if projectDetail.projectDescription}   
  <p 
  class="whitespace-pre-line text-xs p-0 m-0"
  property="schema:descrition">
      { projectDetail.projectDescription.value }
  </p>
  {/if}
</div>