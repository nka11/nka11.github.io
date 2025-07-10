import { Literal, NamedNode, BlankNode, type Term } from "oxigraph"
import type { IEducationDetails, IOrganizationRole, ISkillsDetails } from "../models";
import { mapToObject, oxigraphStore } from "../semantic_cv_store";
import { get } from "svelte/store";

export function listEducations(subject: NamedNode, attribute: string = "schema:about", lang: string = "fr" ): IEducationDetails[] {
    
    let results: IEducationDetails[] = [];
    const { store, oxiReady } = get(oxigraphStore);
      if (!oxiReady) {
        console.log("listCredentials: semantic store not ready");
        return results;
    }
    const educationQuery = `
		    PREFIX schema: <https://schema.org/>

            SELECT ?educ ?educName ?educLocationName ?educLocationAddress ?educLevel ?educStart ?educEnd
            WHERE {
                ${subject} ${attribute} ?educ .
                ?educ schema:name ?educName .
                OPTIONAL {
                ?educ schema:educationalLevel ?educLevel .
                }
                OPTIONAL {
                ?educ schema:startDate ?educStart .
                }
                OPTIONAL {
                ?educ schema:endDate ?educEnd .
                }
                OPTIONAL {
                ?educ schema:location ?locationEntity .
                ?locationEntity schema:name ?educLocationName .
                OPTIONAL {
                    ?locationEntity schema:address ?educLocationAddress .
                }
                }
            }
        `;
        try {
            results = (store?.query(educationQuery) as unknown as Map<string, Term>[]).map(mapToObject) as IEducationDetails[];
            
          } catch(e) { // silent fail
            console.error(e);
          }
    return results;
}