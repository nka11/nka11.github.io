
<div>Affichage du CV</div>
    <article
            prefix="
            nkonto: <https://nka11.github.io/ontology#>
            schema: https://schema.org/
            "
            typeof="schema:Person"
            about={ `${person.person.value}` }>
            <h2 property="schema:name">{person.name?.value}</h2>
            <p><strong property="schema:jobTitle">{person.jobTitle?.value}</strong></p>
            <p style="font-size: 0.95rem;text-align: justify;white-space: pre-line;" property="schema:description">{person.description?.value}</p>
    
            <Experiences person={person.person} lang={browsingPreferences.lang}></Experiences>
            <h2 class="text-3xl">{$T('cv.skills')}</h2>
            <!-- <section> -->
            <SkillsCloud skills={ skills }></SkillsCloud>
            <!-- <ForceGraphSkills></ForceGraphSkills> -->
            <!-- </section> -->
            <ListEducations of={ person.person }></ListEducations>
            <section>
    
            </section>
            <h2 class="text-3xl">{$T('cv.languages')}</h2>
            <section>
                <PersonLangs person={ person.person }/>
            </section>
            <h2 class="text-3xl">{$T('cv.personal_projects')}</h2>
            <section>
                <PersonalProjects person={person.person}></PersonalProjects>
            </section>
    
    </article>
    
<script lang="ts">
    import type { IPersonDetails, ISkillsCount } from "$lib/semcv/models";
    import Experiences from "./Experiences.svelte";
    import ListEducations from "./ListEducations.svelte";
    import PersonLangs from "./PersonLangs.svelte";
    import SkillsCloud from "./SkillsCloud.svelte";
  import { browsingPreferences } from '$lib/state.svelte';
    import PersonalProjects from "./PersonalProjects.svelte";
    import { namedNode } from "oxigraph";
    import { getPerson } from "$lib/semcv/adapters/personAdapters";
    import { skillsCounts } from "$lib/semcv/adapters/skillsAdapter";
    import { T } from '$lib/i18n';


let params:{
    person: IPersonDetails,
    lang?: string
  } = $props();
  const skills = skillsCounts(browsingPreferences.lang);
  const person = getPerson(namedNode(params.person.person.value),browsingPreferences.lang);
</script>