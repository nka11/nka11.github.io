<script lang="ts">
  import { locale, _ } from 'svelte-i18n';
  
  import { onMount } from 'svelte';
  import OrganizationRole from '$lib/components/schemaorgcv/OrganisationRole.svelte';
  import { oxigraphStore, initOxigraph, compareExperience } from '$lib/semcv/semantic_cv_store';
  import { get } from 'svelte/store';
  import type { IOrganizationRole, IPersonDetails, ISkillsCount } from '$lib/semcv/models';
  import { namedNode, NamedNode, type Store, type Term } from 'oxigraph';
  import ListEducations from '$lib/components/schemaorgcv/ListEducations.svelte';
  import { getPerson } from '$lib/semcv/adapters/personAdapters';
  import { listOrgRoles } from '$lib/semcv/adapters/experienceAdapter';
    import { skillsCounts } from '$lib/semcv/adapters/skillsAdapter';
    import SkillsCloud from '$lib/components/schemaorgcv/SkillsCloud.svelte';
    import ListPersonalProjects from '$lib/components/schemaorgcv/ListPersonalProjects.svelte';
    import PdfPrint from '$lib/components/schemaorgcv/PDF_print.svelte';
    import PersonLangs from '$lib/components/schemaorgcv/PersonLangs.svelte';
  
    export let data: {jsonld: any, dataFiles: string[]};
  
    let mainResult: Array<any> = [];
  let person: IPersonDetails | undefined = undefined;
  let organizationRoles: IOrganizationRole[] = [];
  let skills: ISkillsCount[] = [];
  let error = '';
  let oxistore: Store;
  let loading = true;
  let savedLang: string = 'en';
  // https://europa.eu/europass/elm-browser/documentation/rdf/ontology/documentation/elm.html#/
  const changeLang = (lang: string) => {
    locale.set(lang);
    loadCVData(lang);
    savedLang = lang;
    localStorage.setItem('lang', lang);
  };

  const jsonLD = JSON.stringify(data.jsonld);
  const ldString = `<script type=\"application/ld+json\">${jsonLD}\u003C/script>`;

  
  async function loadCVData(lang: string = 'fr') {

      const personNode: NamedNode = namedNode("https://nka11.github.io/#me")
      person = getPerson(personNode,lang);
      skills = skillsCounts(lang);
      organizationRoles = listOrgRoles(person?.person, "schema:hasOccupation",lang).sort(compareExperience);
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
        loadCVData(savedLang);      
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
<PdfPrint personDetails={ person as IPersonDetails }></PdfPrint>
<button on:click={() => changeLang('fr')}>FR</button>
<button on:click={() => changeLang('en')}>EN</button>
<!-- 
  <select on:change={(e) => changeLang(e.target.value)}>
    <option value="en">English</option>
    <option value="fr">Français</option>
  </select> -->
  {#if person}
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

          <h2 class="text-3xl">Expérience Professionnelle</h2>
      <section 
        class="px-2"
        >
        
        {#each organizationRoles as orgrole}
          <OrganizationRole organizationRole={orgrole}/>
        {/each}
      </section>
      <h2 class="text-3xl">Compétences</h2>
      <!-- <section> -->
          <SkillsCloud skills={ skills }></SkillsCloud>
      <!-- </section> -->
      <h2 class="text-3xl">Formation</h2>
      <ListEducations of={ person }></ListEducations>
      <section>

      </section>
      <h2 class="text-3xl">Langues</h2>
      <section>
        <PersonLangs person={ person.person }/>
      </section>
      <h2 class="text-3xl">Projets Personnels</h2>
      <section>
        <ListPersonalProjects person={person}></ListPersonalProjects>
      </section>

    </article>
  {/if}
  
  
  
{/if}
