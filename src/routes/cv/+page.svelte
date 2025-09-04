<script module>
  export const frontmatter  = {
    title : 'CV et portfolio',
    description : '',
    header: false,
    sidebar: false,
    type: "CV"
  }
</script>

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
    import { sidebar } from '../../theme/layout';
    import ForceGraphSkills from '$lib/components/schemaorgcv/ForceGraphSkills.svelte';
    import Cv from '$lib/components/schemaorgcv/CV.svelte';
  
    export let data: {
      jsonld: any,
      dataFiles: string[],
      variants:{variant:string,name:string}[]};
  // import { userPrefs } from './states';
    let mainResult: Array<any> = [];
  let person: IPersonDetails | undefined = undefined;
  // let organizationRoles: IOrganizationRole[] = [];
  let skills: ISkillsCount[] = [];
  let error = '';
  let oxistore: Store;
  let loading = true;
  let savedLang: string = 'fr';
  // https://europa.eu/europass/elm-browser/documentation/rdf/ontology/documentation/elm.html#/



  // const jsonLD = JSON.stringify(data.jsonld);
  // const ldString = `<script type=\"application/ld+json\">${jsonLD}\u003C/script>`;

  
  async function loadCVData(lang: string = 'fr') {
      browsingPreferences.lang = lang;
      console.log(`LoadCVData ${lang}`);
      const personNode: NamedNode = namedNode("https://nka11.github.io/#me")
      person = getPerson(personNode,lang);
      // if (person.description && person.description.value) frontmatter.description = person.description.value
      // if (person.name && person.name.value) frontmatter.title = `CV de {person.name.value}`
      // organizationRoles = listOrgRoles(person?.person, "schema:hasOccupation",lang).sort(compareExperience);
      // console.log(organizationRoles);
  }

  

  onMount(async () => {
    try {
      const stored = localStorage.getItem('lang');
      if (stored) browsingPreferences.lang = stored;
      await initOxigraph(data.dataFiles); // Exécuté uniquement côté navigateur
      const { store, oxiReady } = get(oxigraphStore);
      if (!oxiReady) {
        console.log("CV layout onMount: semantic store not ready");
        return;
      }
      oxistore = store as unknown as Store;
      // browsingPreferences.lang = 'fr';
      loadCVData(browsingPreferences.lang);      
    } catch (e) {
      console.error(e);
      error = 'Erreur lors de l’exécution du module WASM ou du parsing RDF.';
    } finally {
      loading = false;
    }
  });

</script>

{#key browsingPreferences.lang}
{#if loading}
  <p>Chargement du CV</p>
{:else if error}
  <p style="color: red;">{error}</p>
{:else if person}

<!-- 
  <select on:change={(e) => changeLang(e.target.value)}>
    <option value="en">English</option>
    <option value="fr">Français</option>
    </select> -->
    <!-- <CvMenu person={ person.person }></CvMenu> -->
      <Cv person={person} lang={browsingPreferences.lang}></Cv>
       
  
  
  
{/if}
{/key}