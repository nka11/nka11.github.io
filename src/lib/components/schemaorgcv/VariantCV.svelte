<script lang="ts">
  import type { IPersonDetails, IVariantsDetails } from "$lib/semcv/models";
    import type { NamedNode } from "oxigraph";
  	import { browsingPreferences } from '$lib/state.svelte.js';
    import Experiences from "./Experiences.svelte";
    import { onMount } from "svelte";
    import { getPerson } from "$lib/semcv/adapters/personAdapters";
    import { initOxigraph } from "$lib/semcv/semantic_cv_store";
    import SkillsCloud from "./SkillsCloud.svelte";
    import ListEducations from "./ListEducations.svelte";
    import PersonLangs from "./PersonLangs.svelte";
    import PersonalProjects from "./PersonalProjects.svelte";
    import { T } from '$lib/i18n';
  let params:{
    variant: NamedNode,
    person: NamedNode,
    lang?:string
  } = $props()
  let personDetails:IPersonDetails | undefined = $state();
  onMount(async () => {
      // await initOxigraph(data.dataFiles); // Exécuté uniquement côté navigateur

    // const personNode: NamedNode = namedNode("https://nka11.github.io/#me")
    // variantNode = namedNode(data.metadata);
    // console.log(variantNode);
    personDetails = getPerson(params.person,browsingPreferences.lang,params.variant);

  });
</script>
{#key browsingPreferences.lang}  
  {#if personDetails}
    <h1>
      { personDetails.name?.value }
    </h1>

    <h2>
      { personDetails.jobTitle?.value }
    </h2>
    <p 
    class="whitespace-pre-line">
      { personDetails.description?.value }
    </p>
    <Experiences 
      person={personDetails.person} 
      lang={ browsingPreferences.lang }
      variant={ params.variant }
    ></Experiences>
            <!-- <SkillsCloud skills={ skills }></SkillsCloud> -->
        <!-- </section> -->
    <ListEducations of={ params.person }></ListEducations>
    <section>

    </section>
    <h2 class="text-3xl">{$T('cv.languages')}</h2>
    <section>
      <PersonLangs person={ params.person }/>
    </section>
    <h2 class="text-3xl">{$T('cv.personal_projects')}</h2>
    <section>
      <PersonalProjects person={params.person}></PersonalProjects>
    </section>

  
  {/if}
{/key}