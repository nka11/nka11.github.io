<script lang="ts">
    import { formatDateFr } from "$lib/dateFormatter";
    import type { IProjectDetail } from "$lib/models/schemaorgcv";

export let projectDetail: IProjectDetail = {
    credentialName: null,
    projectName: null,
    projectDescription: null,
    projectStartDate: null,
    projectEndDate: null
  };

</script>

<div 
  class="pt-1 my-0 pb-0"
  typeof="schema:Project">
  <span class="text-sm p-0 m-0">
    <span class="font-bold" property="schema:name">{projectDetail.projectName?.value}</span> :
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