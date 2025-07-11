
import { Literal, NamedNode, BlankNode, type Term } from "oxigraph"
import type { ISkillsCount, ISkillsDetails } from "../models";
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

export function skillsCounts(lang: string = 'en'): ISkillsCount[] {
  let result: ISkillsCount[] = [];
    const { store, oxiReady } = get(oxigraphStore);
      if (!oxiReady) {
        console.log("SkillsAdapter: semantic store not ready");
        return result;
    }
  const skillsCountQuery = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX schema: <https://schema.org/>
    PREFIX elm: <https://data.europa.eu/snb/elm/>
    SELECT
      ?skillName
      (COUNT(?s) AS ?count)
    WHERE {
      {
        ?refedskill a elm:LearningOutcome .
        ?s schema:about ?refedskill .
        ?refedskill elm:relatedSkill ?skill .
        ?skill a elm:LearningOutcome ;
            elm:label ?skillName .
      }
    UNION
      {
        ?refedskill a elm:LearningOutcome .
        ?s schema:competencyRequired ?refedskill .
        ?refedskill elm:relatedSkill ?skill .
        ?skill a elm:LearningOutcome ;
            elm:label ?skillName .
      }
    UNION
      {
         ?refedskill a elm:LearningOutcome .
         ?s schema:skills ?refedskill .
         ?refedskill elm:relatedSkill ?skill .
         ?skill a elm:LearningOutcome ;
            elm:label ?skillName .
      }
    UNION
      {
        ?skill a elm:LearningOutcome ;
          elm:label ?skillName .
        ?s elm:relatedSkill  ?skill .
      } 
    UNION
      {
        ?skill a elm:LearningOutcome ;
          elm:label ?skillName .
        ?s schema:about ?skill .
      } 
    UNION
      {
        ?skill a elm:LearningOutcome ;
          elm:label ?skillName .
        ?s schema:competencyRequired ?skill .
      } 
    UNION 
     {
       ?skill a elm:LearningOutcome ;
         elm:label ?skillName .
       ?s schema:skills ?skill .
    }
    FILTER(LANG(?skillName) = "${lang}" || LANG(?skillName) = "")
    } 
    GROUP BY ?skillName ORDER BY DESC(?count) 
  `

    try {
      // console.log(skillsCountQuery);
      result = (store?.query(skillsCountQuery) as unknown as Map<string, Term>[]).map(mapToObject) as ISkillsCount[];
      // console.log(result);
    } catch(e) { // silent fail
      console.error(e);
    }
    return result;
}