<script lang="ts">
    import { getProjectImpacts, getProjectLifeCycle } from "$lib/semcv/adapters/projectsAdapter";
    import { listSkills } from "$lib/semcv/adapters/skillsAdapter";
    import type { IProjectCycle, IProjectDetail, IProjectImpact, ISkillsDetails } from "$lib/semcv/models";
    import { browsingPreferences } from "$lib/state.svelte";
    import { onMount } from "svelte";
    import Cycle from "./project/Cycle.svelte";
    import Description from "./project/Description.svelte";
    import Skills from "./project/Skills.svelte";
    import Impacts from "./project/Impacts.svelte";
    import CyleDiagram from "./project/CyleDiagram.svelte";

  // === Données extraites du fichier TTL ===
  const props: {
    project: IProjectDetail,
    lang?:string
  } = $props()
  let impactObject:any = $state({})
  const project = props.project;
  browsingPreferences.lang;
  let raw_skills: ISkillsDetails[] = $state([]);
  let savedLang: string = 'en';
  let phases = $state<IProjectCycle>()
  let impacts = $state<IProjectImpact[]>()
  onMount(async () => {
    const stored = localStorage.getItem('lang');
    if (stored) savedLang = stored;
    raw_skills = listSkills(project.project, "schema:about", browsingPreferences.lang);
    raw_skills.forEach((skill: ISkillsDetails) => {
    const value = skill.skillLabel?.value;
      if (skill.parentSkillName) {
        const key = skill.parentSkillName.value;
        if (value) {
          if (skills[key]) {
            skills[key].push(value);
          } else {
            skills[key] = [value];
          }
        }
      } else {
        if (value)
          skills["undefined"].push(value);
      }
    });
    phases = getProjectLifeCycle(project.project,browsingPreferences.lang)
    impacts = getProjectImpacts(project.project,browsingPreferences.lang)
    // let impacts:any = $state({});
// console.log(props.impact)
    impacts?.forEach((impact:IProjectImpact) => {
      if (impact.type?.value) { if (impact.type.value in impactObject) {
        impactObject[impact.type.value].push(impact.name?.value)
      } else {
        impactObject[impact.type.value] = [impact.name?.value]
      }}
    });
  
  });

  

  // const impacts = {
  //   Organizational: [
  //     "Unified Identity and Access Management",
  //     "Standardization of Project Blueprints"
  //   ],
  //   Technical: [
  //     "Event-Driven Architecture Modernization",
  //     "Infrastructure as Code"
  //   ],
  //   Data: [
  //     "Improved Data Availability",
  //     "Better Data Traceability"
  //   ],
  //   User: [
  //     "Faster Time to Insight",
  //     "Report Consistency"
  //   ]
  // };

  const skills = $state<{ [key: string]: string[] }>({
    "undefined": []
  });
</script>

<div class="project">
  <Cycle phases={phases} />
  <Description project={project}/>
  <!-- <CyleDiagram phases={phases}></CyleDiagram> -->
  <Impacts impacts={impactObject} />
  <Skills skills={skills} />
</div>

<style>
  .project {
    /* max-width: 900px; */
    margin: 0.5rem auto;
    padding: 0.6rem;
    background-color: #f8f8f8;
    border-radius: 0.5rem;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    font-family: system-ui, sans-serif;
    color: #333;
  }
</style>