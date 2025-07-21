<script lang="ts">
    import { getProjectLifeCycle } from "$lib/semcv/adapters/projectsAdapter";
    import { listSkills } from "$lib/semcv/adapters/skillsAdapter";
    import type { IProjectCycle, IProjectDetail, ISkillsDetails } from "$lib/semcv/models";
    import { browsingPreferences } from "$lib/state.svelte";
    import { onMount } from "svelte";
    import Cycle from "./project/Cycle.svelte";
    import Description from "./project/Description.svelte";
    import Skills from "./project/Skills.svelte";
    import Impacts from "./project/Impacts.svelte";

  // === Données extraites du fichier TTL ===
  const props: {
    project: IProjectDetail,
    lang?:string
  } = $props()
  const project = props.project;
  browsingPreferences.lang;
  let raw_skills: ISkillsDetails[] = $state([]);
  let savedLang: string = 'en';
  let phases = $state<IProjectCycle>()
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
  });


  // const phases = [
  //   { name: "Design", role: "Tech Lead / Product Owner", count: 1 },
  //   { name: "Code", role: "Developer", count: 10 },
  //   { name: "Build", role: "Developer / DevOps", count: 20 },
  //   { name: "Delivery", role: "DevOps", count: 5 },
  //   { name: "Observability", role: "DevOps / SRE", count: 50 },
  //   { name: "Run", role: "SRE", count: 100 }
  // ];

  

  const impacts = {
    Organizational: [
      "Unified Identity and Access Management",
      "Standardization of Project Blueprints"
    ],
    Technical: [
      "Event-Driven Architecture Modernization",
      "Infrastructure as Code"
    ],
    Data: [
      "Improved Data Availability",
      "Better Data Traceability"
    ],
    User: [
      "Faster Time to Insight",
      "Report Consistency"
    ]
  };

  const skills = $state<{ [key: string]: string[] }>({
    "undefined": []
  });
</script>

<div class="project">
  <Description project={project}/>
  <Cycle phases={phases} />
  <Impacts impacts={impacts} />
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