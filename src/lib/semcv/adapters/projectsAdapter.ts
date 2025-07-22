
import { Literal, NamedNode, BlankNode, type Term } from "oxigraph"
import type { IProjectCycle, IProjectDetail, IProjectImpact, ISkillsDetails } from "../models";
import { mapToObject, oxigraphStore } from "../semantic_cv_store";
import { get } from "svelte/store";

export function listProjects(subject: NamedNode, attribute: string = "schema:about", lang: string = "fr" ): IProjectDetail[] {
    
    let result: IProjectDetail[] = [];
    const { store, oxiReady } = get(oxigraphStore);
      if (!oxiReady) {
        console.log("listProjects: semantic store not ready");
        return result;
    }
    const listProjectsQuery = `
        PREFIX schema: <https://schema.org/>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        prefix elm: <https://data.europa.eu/snb/elm/>
        
        SELECT
            ?project ?projectName ?roleName ?projectDescription ?projectStartDate ?projectEndDate
        WHERE {
		      ${subject} ${attribute} ?project .
        ?project a schema:Project ;
                      schema:name ?projectName.
            FILTER(LANG(?projectName) = "${lang}" || LANG(?projectName) = "")
          OPTIONAL {
            ?project a schema:Project ;
                schema:description ?projectDescription .
                FILTER(LANG(?projectDescription) = "${lang}" || LANG(?projectDescription) = "")
          }
          OPTIONAL {
            ?project a schema:Project ;
                schema:roleName ?roleName .
                FILTER(LANG(?roleName) = "${lang}" || LANG(?roleName) = "")
          }
          OPTIONAL {
             ?project a schema:Project ;
                schema:startDate ?projectStartDate .
          }
          OPTIONAL {
             ?project a schema:Project ;
                schema:endDate ?projectEndDate .
          }

        }    ORDER BY  DESC(?projectStartDate) 
    `;
    try {
      // console.log(listProjectsQuery);
       result = (store?.query(listProjectsQuery) as unknown as Map<string, Term>[]).map(mapToObject) as IProjectDetail[];
      } catch(e) { // silent fail
        console.error(e);
      }
    return result;
}

export function getProjectLifeCycle(subject: NamedNode, lang: string = "fr"): IProjectCycle {
  const getProjectLifeCycleQuery = `
    PREFIX schema: <https://schema.org/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    prefix elm: <https://data.europa.eu/snb/elm/>
    prefix product-cycle-actions: <https://nka11.github.io/cv#actions/>
    
    SELECT
      ?project
      (SAMPLE(?designs) AS ?design)
      (SAMPLE(?codes) AS ?code)
      (SAMPLE(?builds) AS ?build)
      (SAMPLE(?deliverys) AS ?delivery)
      (SAMPLE(?observabilitys) AS ?observability)
      (SAMPLE(?runs) AS ?run)
    WHERE {
      ${subject} a schema:Project ; 
        schema:agentInteractionStatistic ?interaction.

      OPTIONAL {
        ?interaction schema:interactionType product-cycle-actions:design ;
          schema:description ?designs.
        FILTER(LANG(?designs) = "${lang}" || LANG(?designs) = "")
      }
      OPTIONAL {
        ?interaction schema:interactionType product-cycle-actions:code ;
          schema:description ?codes.
        FILTER(LANG(?codes) = "${lang}" || LANG(?codes) = "")
      }
      OPTIONAL {
        ?interaction schema:interactionType product-cycle-actions:build ;
          schema:description ?builds.
        FILTER(LANG(?builds) = "${lang}" || LANG(?builds) = "")
      }
      OPTIONAL {
        ?interaction schema:interactionType product-cycle-actions:delivery ;
          schema:description ?deliverys.
        FILTER(LANG(?deliverys) = "${lang}" || LANG(?deliverys) = "")
      }
      OPTIONAL {
        ?interaction schema:interactionType product-cycle-actions:observability ;
          schema:description ?observabilitys.
        FILTER(LANG(?observabilitys) = "${lang}" || LANG(?observabilitys) = "")
      }
      OPTIONAL {
        ?interaction schema:interactionType product-cycle-actions:run ;
          schema:description ?runs.
        FILTER(LANG(?runs) = "${lang}" || LANG(?runs) = "")
      }
    }
    GROUP BY ?project
    LIMIT 1
  `;
  // console.log(getProjectLifeCycleQuery)
  // let result: IProjectCycle[] = [];
  const { store, oxiReady } = get(oxigraphStore);
  if (!oxiReady) {
    throw "projectLifeCycle: semantic store not ready";
  }
  try {
    const results = (store?.query(getProjectLifeCycleQuery) as unknown as Map<string, Term>[]).map(mapToObject) as IProjectCycle[];
    if (results.length == 1) {
      let result: IProjectCycle = results[0] ;
      return result;
    } else {
      throw `Entity not found or not unique (length ${results.length})`;
    }
  } catch(e) { // silent fail
    throw e;
  }
}

export function getProjectImpacts(subject: NamedNode, lang: string = "fr"): IProjectImpact[] {
  let result:IProjectImpact[] = [];
  const { store, oxiReady } = get(oxigraphStore);
  if (!oxiReady) {
    console.log("listProjects: semantic store not ready");
    return result;
  }
  const getProjectImpactsQuery = `
	  prefix impact: <https://nka11.github.io/cv#projects/cm-road45/impact/>
    prefix nkonto: <https://nka11.github.io/ontology#>

    PREFIX schema: <https://schema.org/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    prefix elm: <https://data.europa.eu/snb/elm/>
    prefix product-cycle-actions: <https://nka11.github.io/cv#actions/>
    prefix project: <https://nka11.github.io/cv#projects/>
    SELECT
      ?impact ?type ?name ?description

    WHERE {
      ${subject} a schema:Project ; 
        nkonto:hasImpact ?impact .
      OPTIONAL {
        ?impact schema:name ?name .
        FILTER(LANG(?name) = "${lang}" || LANG(?name) = "")
      }
       OPTIONAL {
        ?impact schema:description ?description .
        FILTER(LANG(?description) = "${lang}" || LANG(?description) = "")
      }
      OPTIONAL {
        ?impact rdf:type ?impactType .
    	?impactType schema:name ?type .
        FILTER(LANG(?type) = "${lang}" || LANG(?type) = "")
      }
    }

  `;
  try {
      console.log(getProjectImpactsQuery);
       result = (store?.query(getProjectImpactsQuery) as unknown as Map<string, Term>[]).map(mapToObject) as IProjectImpact[];
      } catch(e) { // silent fail
        console.error(e);
      }
    return result;
}