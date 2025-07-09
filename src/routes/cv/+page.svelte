<script lang="ts">
  import { locale, _ } from 'svelte-i18n';
  
  import { onMount } from 'svelte';
  import OrganizationRole from '$lib/components/schemaorgcv/OrganisationRole.svelte';
  import { oxigraphStore, initOxigraph } from '$lib/semcv/semantic_cv_store';
  import { get } from 'svelte/store';
  import type { IOrganizationRole, IPersonDetails } from '$lib/semcv/models';
  import { namedNode, NamedNode, type Store, type Term } from 'oxigraph';
  import ListEducations from '$lib/components/schemaorgcv/ListEducations.svelte';
  import { getPerson } from '$lib/semcv/adapters/personAdapters';
  import { listOrgRoles } from '$lib/semcv/adapters/experienceAdapter';
  let mainResult: Array<any> = [];
  let person: IPersonDetails | undefined = undefined;
  let organizationRoles: IOrganizationRole[] = [];
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
  // tool to compare experience dates to sort
  function compareExperience(exp1: IOrganizationRole, exp2: IOrganizationRole) {
    if (!exp1.endDate && !exp2.endDate) {
      if ((exp1.startDate?.value ?? '') < (exp2.startDate?.value ?? ''))  return  -1
      return 1;
    }
    if (!exp1.endDate && exp2.endDate) {
      return -1;
    }
    if (exp1.endDate && !exp2.endDate) {
      return 1;
    }
    if ((exp1.endDate?.value ?? '') < (exp2.endDate?.value ?? '')) {
      return 1;
    }
    return -1;
  }
  async function loadCVData(lang: string = 'fr') {

      const personNode: NamedNode = namedNode("https://nka11.github.io/#me")
      person = getPerson(personNode,lang);
      
      organizationRoles = listOrgRoles(person?.person, "schema:hasOccupation",lang).sort(compareExperience);
      console.log(organizationRoles);
  }

  

  onMount(async () => {
    try {
      const stored = localStorage.getItem('lang');
      if (stored) savedLang = stored;
      await initOxigraph(); // Exécuté uniquement côté navigateur
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
      {#if person.lang}
          <p>Langue : {person.lang?.value}</p>
      {/if}

          <h2 class="text-3xl">Expérience Professionnelle</h2>
      <section 
        class="px-2"
        >
        
        {#each organizationRoles as orgrole}
          <OrganizationRole organizationRole={orgrole}/>
        {/each}
      </section>
      <h2 class="text-3xl">Compétences</h2>
      <section>

      </section>
      <h2 class="text-3xl">Formation</h2>
      <ListEducations of={ person }></ListEducations>
      <section>

      </section>
      <h2 class="text-3xl">Langues</h2>
      <section>

      </section>
      <h2 class="text-3xl">Projets Personnels</h2>
      <section>

      </section>

    </article>
  {/if}
  
  
  
{/if}
