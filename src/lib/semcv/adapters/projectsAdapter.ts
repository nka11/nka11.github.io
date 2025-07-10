
import { Literal, NamedNode, BlankNode, type Term } from "oxigraph"
import type { IProjectDetail, ISkillsDetails } from "../models";
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
        PREFIX sc: <https://schema.org/>
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