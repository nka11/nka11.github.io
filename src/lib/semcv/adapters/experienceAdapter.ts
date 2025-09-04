import { Literal, NamedNode, BlankNode, type Term } from "oxigraph"
import type { ICredentialDetails, IOrganizationRole, ISkillsDetails } from "../models";
import { mapToObject, oxigraphStore } from "../semantic_cv_store";
import { get } from "svelte/store";

export function listOrgRoles(
        subject: NamedNode,
        attribute: string = "schema:about",
        lang: string = "fr",
        variant: NamedNode | undefined = undefined
    ): IOrganizationRole[] {
    console.log(`listOrgRoles ${lang}`);

    let experienceQuery = `
        PREFIX schema: <https://schema.org/>
        prefix nkonto: <https://nka11.github.io/ontology#>
        
        SELECT ?role ?roleName ?employer ?startDate ?endDate ?description ?identifier ?url
        WHERE {
            ${subject} ${attribute} ?role .
            ?role schema:roleName ?roleName ;
                schema:identifier ?identifier ;
                schema:startDate ?startDate ;
                nkonto:withinOrganization ?org .
            FILTER(LANG(?roleName) = "${lang}" || LANG(?roleName) = "")
            ?org schema:name ?employer .
            OPTIONAL {
                ?role schema:endDate ?endDate .
            }
            OPTIONAL {
                ?role schema:description ?description .
                FILTER(LANG(?description) = "${lang}" || LANG(?description) = "")
            }
            OPTIONAL {
                ?role schema:url ?url .
            }
        }
        ORDER BY DESC(?endDate)
    `;
    if (variant) {
      experienceQuery = `
        prefix nkonto: <https://nka11.github.io/ontology#>
        PREFIX schema: <https://schema.org/>
        SELECT ?role ?roleName ?employer ?startDate ?endDate ?description ?identifier ?url
        WHERE {
            ${subject} ${attribute} ?role .
            ?role schema:roleName ?roleNameTerm ;
                schema:identifier ?identifier ;
                schema:startDate ?startDate ;
                nkonto:withinOrganization ?org .
            
            ?roleNameTerm a schema:DefinedTerm ;
              schema:inDefinedTermSet ${variant};
              schema:name ?roleName .

            FILTER(LANG(?roleName) = "${lang}" || LANG(?roleName) = "")
            ?org schema:name ?employer .
            OPTIONAL {
                ?role schema:endDate ?endDate .
            }
            OPTIONAL {
                ?role schema:url ?url .
            }
            OPTIONAL {
                ?role schema:roleName ?roleNameTerm ;
                    schema:description ?descriptionTerm .
                ?descriptionTerm a schema:DefinedTerm ;
                    schema:inDefinedTermSet ${variant};
                    schema:description ?description .
                FILTER(LANG(?description) = "${lang}" || LANG(?description) = "")
            }
        }
        ORDER BY DESC(?endDate)
        `
    }    
    
    let results: IOrganizationRole[] = [];
    const { store, oxiReady } = get(oxigraphStore);
      if (!oxiReady) {
        console.log("listCredentials: semantic store not ready");
        return results;
    }
        try {
            // console.log(experienceQuery);
            results = (store?.query(experienceQuery) as unknown as Map<string, Term>[]).map(mapToObject) as IOrganizationRole[];
            // console.log(results);
          } catch(e) { // silent fail
            console.error(e);
          }
    return results;
}