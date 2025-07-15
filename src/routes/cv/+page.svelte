<script lang="ts">
  import { locale, _ } from 'svelte-i18n';
  
  import { onMount } from 'svelte';
  import { oxigraphStore, initOxigraph, compareExperience } from '$lib/semcv/semantic_cv_store';
  import { get } from 'svelte/store';
  import type { IOrganizationRole, IPersonDetails, ISkillsCount } from '$lib/semcv/models';
  import { namedNode, NamedNode, type Store, type Term } from 'oxigraph';
  import ListEducations from '$lib/components/schemaorgcv/ListEducations.svelte';
  import { getPerson } from '$lib/semcv/adapters/personAdapters';
  import { listOrgRoles } from '$lib/semcv/adapters/experienceAdapter';
  import { skillsCounts } from '$lib/semcv/adapters/skillsAdapter';
  import SkillsCloud from '$lib/components/schemaorgcv/SkillsCloud.svelte';
  import ListPersonalProjects from '$lib/components/schemaorgcv/PersonalProjects.svelte';
  import PersonLangs from '$lib/components/schemaorgcv/PersonLangs.svelte';
  import CvMenu from '../../lib/components/schemaorgcv/CVMenu.svelte';
  import { browsingPreferences } from '$lib/state.svelte';
  import Experiences from '$lib/components/schemaorgcv/Experiences.svelte';
  
    export let data: {jsonld: any, dataFiles: string[],variants:{variant:string,name:string}[]};
  // import { userPrefs } from './states';

    let mainResult: Array<any> = [];
  let person: IPersonDetails | undefined = undefined;
  let organizationRoles: IOrganizationRole[] = [];
  let skills: ISkillsCount[] = [];
  let error = '';
  let oxistore: Store;
  let loading = true;
  let savedLang: string = 'en';
  // https://europa.eu/europass/elm-browser/documentation/rdf/ontology/documentation/elm.html#/



  const jsonLD = JSON.stringify(data.jsonld);
  const ldString = `<script type=\"application/ld+json\">${jsonLD}\u003C/script>`;

  
  async function loadCVData(lang: string = 'fr') {

      const personNode: NamedNode = namedNode("https://nka11.github.io/#me")
      person = getPerson(personNode,browsingPreferences.lang);
      skills = skillsCounts(lang);
      organizationRoles = listOrgRoles(person?.person, "schema:hasOccupation",browsingPreferences.lang).sort(compareExperience);
      console.log(organizationRoles);
  }

  

  onMount(async () => {
    try {
      const stored = localStorage.getItem('lang');
      if (stored) savedLang = stored;
      await initOxigraph(data.dataFiles); // Exécuté uniquement côté navigateur
      const { store, oxiReady } = get(oxigraphStore);
      if (!oxiReady) {
        console.log("CV layout onMount: semantic store not ready");
        return;
      }
      oxistore = store as unknown as Store;
      loadCVData(browsingPreferences.lang);      
    } catch (e) {
      console.error(e);
      error = 'Erreur lors de l’exécution du module WASM ou du parsing RDF.';
    } finally {
      loading = false;
    }
  });

</script>

{#if loading}
  <p>Chargement du CV</p>
{:else if error}
  <p style="color: red;">{error}</p>
{:else if mainResult}

<!-- 
  <select on:change={(e) => changeLang(e.target.value)}>
    <option value="en">English</option>
    <option value="fr">Français</option>
    </select> -->
    {#if person}
    <CvMenu person={ person.person }></CvMenu>
    {#key browsingPreferences.lang}
      <article
      prefix="
        schema: https://schema.org/
      "
      typeof="schema:Person"
      about={ `${person.person.value}` }>
        <h2 property="schema:name">{person.name?.value}</h2>
        <p><strong property="schema:jobTitle">{person.jobTitle?.value}</strong></p>
        <!-- {#if person.lang}
            <p>Langue : {person.lang?.value}</p>
        {/if} -->

        <Experiences person={person.person}></Experiences>
        <h2 class="text-3xl">Compétences</h2>
        <!-- <section> -->
        <SkillsCloud skills={ skills }></SkillsCloud>
        <!-- </section> -->
        <ListEducations of={ person.person }></ListEducations>
        <section>

        </section>
        <h2 class="text-3xl">Langues</h2>
        <section>
          <PersonLangs person={ person.person }/>
        </section>
        <h2 class="text-3xl">Projets Personnels</h2>
        <section>
          <ListPersonalProjects person={person.person}></ListPersonalProjects>
        </section>

      </article>
        
    {/key}
  {/if}
  
  
  
{/if}
