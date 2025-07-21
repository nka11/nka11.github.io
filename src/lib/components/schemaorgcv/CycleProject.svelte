<script lang="ts">
    import { getProjectLifeCycle } from "$lib/semcv/adapters/projectsAdapter";
    import { listSkills } from "$lib/semcv/adapters/skillsAdapter";
    import type { IProjectCycle, IProjectDetail, ISkillsDetails } from "$lib/semcv/models";
    import { browsingPreferences } from "$lib/state.svelte";
    import { onMount } from "svelte";

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
  <h2>{project.projectName?.value}</h2>
  <div class="subtitle">Club Med – {project.projectStartDate?.value} → {project.projectEndDate?.value}</div>
  {#if phases}
    <div class="timeline">
      <div class="phase">
        <div class="phase-name">Design</div>
        <div class="phase-role">{phases?.design?.value}</div>
      </div>
      <div class="phase">
        <div class="phase-name">Code</div>
        <div class="phase-role">{phases?.code?.value}</div>
      </div>
      <div class="phase">
        <div class="phase-name">Build</div>
        <div class="phase-role">{phases?.build?.value}</div>
      </div>
      <div class="phase">
        <div class="phase-name">Delivery</div>
        <div class="phase-role">{phases?.delivery?.value}</div>
      </div>
      <div class="phase">
        <div class="phase-name">Observability</div>
        <div class="phase-role">{phases?.observability?.value}</div>
      </div>
      <div class="phase">
        <div class="phase-name">Run</div>
        <div class="phase-role">{phases?.run?.value}</div>
      </div>

    </div>
  {/if}

  <p class="project-desc">
    {@html project.projectDescription?.value}
  </p>

  <!-- <h3>⚙️ Full Project Lifecycle</h3> -->

  <!-- <div class="impacts-section">
    <h3>Project Impacts</h3>
    <div class="impacts-grid">
      {#each Object.entries(impacts) as [category, items]}
        <div class="impact-box">
          <div class="impact-category">{category}</div>
          {#each items as item}
            <div class="badge">{item}</div>
          {/each}
        </div>
      {/each}
    </div>
  </div> -->

  <div class="skills-section">
    <h3>Skills Used</h3>
    <div class="skills-grid">
      {#each Object.entries(skills) as [category, list]}
        <div class="skill-box">
          {#if category != "undefined"}
            <div class="skill-category">{category}</div>
          {/if}
          {#each list as skill}
            <span class="skill-tag">{skill}</span>
          {/each}
        </div>
      {/each}
    </div>
  </div>
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

  h2 {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0 0 0 0.25rem;
    border: none;
  }

  h3 {
    font-size: 1.1rem;
    margin-top: 0rem;
    margin-bottom: 0.2rem;
    font-weight: bold;
    color: #222;
  }

  .subtitle {
    font-size: 0.9rem;
    color: #555;
    margin-bottom: 1rem;
    font-style: italic;
  }

  .project-desc {
    font-size: 1.15rem;
    color: #444;
    white-space: pre-line;
    text-align: justify;
    line-height: 1.5;
  }

  .timeline {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0.2rem;
    text-align: center;
    margin-top: 1rem;
  }

  .phase {
    background-color: #f9f9f9;
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid #ddd;
    transition: box-shadow 0.2s ease;
  }

  .phase:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  }

  .phase-name {
    font-weight: bold;
    color: #0053a6;
    margin-bottom: 0.25rem;
  }

  .phase-role {
    font-size: 0.85rem;
    color: #777;
    font-style: italic;
  }

  .phase-count {
    font-size: 0.75rem;
    color: #aaa;
    margin-top: 0.3rem;
  }
  .impacts-section {
    /* border: 1px solid #ddd;
    border-radius: 0.5rem; */
    margin-top: 0.5rem;
    
  }
  .impacts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.5rem;
    /* margin-top: 1rem; */
  }

  .impact-box {
    background-color: #f4f4f4;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    padding: 0.5rem;
  }

  .impact-category {
    font-size: 0.9rem;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
    color: #444;
  }

  .badge {
    display: inline-block;
    background-color: #e0f0ff;
    color: #0053a6;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    margin: 0.25rem 0.4rem 0.4rem 0;
  }
  .skills-section {
    /* border: 1px solid #ddd;
    border-radius: 0.5rem; */
    margin-top: 0.5rem;
    
  }
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(2rem, 1fr));
    gap: 0.5rem;
    /* margin-top: 0.5rem; */
  }

  .skill-box {
    background-color: #f8f8f8;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    padding: 0.5rem;
  }

  .skill-category {
    font-size: 0.9rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    color: #444;
  }

  .skill-tag {
    display: inline-block;
    background-color: #d1f1d1;
    color: #176b34;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    margin: 0.25rem 0.4rem 0.4rem 0;
  }
</style>