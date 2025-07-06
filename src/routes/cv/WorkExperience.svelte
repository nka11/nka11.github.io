<script>
  export let workExperience = {
    jobTitle: null,
    employer: null,
    startDate: null,
    endDate: null,
    description: null,
    place: null,
    classification: "http://data.europa.eu/snb/elm/classification/workbasedlearning" // ou null
  };

  function formatDateFr(dateStr) {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      if (isNaN(date)) return null;
      const day = date.getDate();
      const dayStr = day === 1 ? "1er" : day;
      const month = date.toLocaleString("fr-FR", { month: "long" });
      const year = date.getFullYear();
      return `${dayStr} ${month} ${year}`;
    } catch {
      return dateStr;
    }
  }
</script>

<!-- Entité RDFa : LearningActivity représentant une expérience pro -->
<div
  typeof="elm:LearningActivity"
  vocab="https://data.europa.eu/snb/elm/"
  class="border-b border-gray-300 py-4 last:border-0"
>

  <!-- Typage explicite : classification ou specifiedBy -->
  {#if workExperience.classification}
    <link property="elm:hasClassification" href={workExperience.classification} />
  {/if}

  {#if workExperience.jobTitle}
    <h3
      property="elm:hasJobTitle"
      class="text-lg font-semibold text-gray-900"
    >
      {workExperience.jobTitle.value}
    </h3>
  {/if}

  {#if workExperience.employer || workExperience.startDate || workExperience.endDate}
    <p class="text-sm text-gray-700 mb-1">
      {#if workExperience.employer}
        <span property="elm:hasEmployer" class="font-medium">{workExperience.employer.value}</span>
      {/if}

      {#if workExperience.employer && (workExperience.startDate || workExperience.endDate)}
        <span class="mx-2">—</span>
      {/if}

      {#if workExperience.startDate}
        <time
          property="elm:startDate"
          datetime={workExperience.startDate.value}
          datatype="xsd:date"
          class="italic"
        >
          {formatDateFr(workExperience.startDate.value)}
        </time>
      {/if}

      {#if workExperience.startDate && workExperience.endDate}
        <span class="mx-1">à</span>
      {/if}

      {#if workExperience.endDate}
        <time
          property="elm:endDate"
          datetime={workExperience.endDate.value}
          datatype="xsd:date"
          class="italic"
        >
          {formatDateFr(workExperience.endDate.value)}
        </time>
      {/if}
    </p>
  {/if}

  {#if workExperience.place}
    <p property="elm:hasLocation" class="text-sm text-gray-600 mb-1">
      {workExperience.place.value}
    </p>
  {/if}

  {#if workExperience.description}
    <p property="elm:description" class="text-gray-800 text-sm whitespace-pre-line">
      {workExperience.description.value}
    </p>
  {/if}
</div>
