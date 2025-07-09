
import { Literal, NamedNode, BlankNode, type Term } from "oxigraph"
import type { ISkillsDetails } from "../models";
import { mapToObject, oxigraphStore } from "../semantic_cv_store";
import { get } from "svelte/store";

export function listSkills(subject: NamedNode, attribute: string = "schema:about", lang: string = "fr" ): ISkillsDetails[] {
    
    let result: ISkillsDetails[] = [];
    const { store, oxiReady } = get(oxigraphStore);
      if (!oxiReady) {
        console.log("SkillsAdapter: semantic store not ready");
        return result;
    }
    const skillsQuery = `
        PREFIX sc: <https://schema.org/>
        PREFIX schema: <https://schema.org/>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        prefix elm: <https://data.europa.eu/snb/elm/>
        
        SELECT
            ?skill 
            ?skillLabel 
            ?parentSkill 
            ?parentSkillName 
        WHERE {
		  ${subject} ${attribute} ?skill .
        OPTIONAL {
            ?skill a schema:DefinedTerm ;
                elm:label ?skillLabel .
            FILTER(LANG(?skillLabel) = "${lang}" || LANG(?skillLabel) = "")
            OPTIONAL {
              ?skill elm:relatedSkill ?parentSkill .
              OPTIONAL {
                ?parentSkill elm:label ?parentSkillName .
                FILTER(LANG(?parentSkillName) = "${lang}" || LANG(?parentSkillName) = "")
              }
            }
          }
        }
    `;
    try {
       result = (store?.query(skillsQuery) as unknown as Map<string, Term>[]).map(mapToObject) as ISkillsDetails[];
      } catch(e) { // silent fail
        console.error(e);
      }
    return result;
}