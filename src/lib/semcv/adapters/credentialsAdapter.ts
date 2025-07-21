
import { Literal, NamedNode, BlankNode, type Term } from "oxigraph"
import type { ICredentialDetails, ISkillsDetails } from "../models";
import { mapToObject, oxigraphStore } from "../semantic_cv_store";
import { get } from "svelte/store";

export function listCredentials(
  subject: NamedNode,
  attribute: string = "schema:about",
  lang: string = "fr",
  variant: NamedNode | undefined = undefined
): ICredentialDetails[] {
    
    let result: ICredentialDetails[] = [];
    const { store, oxiReady } = get(oxigraphStore);
      if (!oxiReady) {
        console.log("listCredentials: semantic store not ready");
        return result;
    }
    let credentialsQuery = `
      PREFIX sc: <https://schema.org/>
      PREFIX schema: <https://schema.org/>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      prefix elm: <https://data.europa.eu/snb/elm/>
      
      SELECT

          ?credential ?credentialName ?credentialDescription ?credentialIdentifier ?credentialStartDate ?credentialEndDate
      WHERE {
        ${subject} ${attribute} ?credential .
        OPTIONAL {
            ?credential a schema:EducationalOccupationalCredential ;
                schema:name ?credentialName .
          FILTER(LANG(?credentialName) = "${lang}" || LANG(?credentialName) = "")
        }
        OPTIONAL {
          ?credential a schema:EducationalOccupationalCredential ;
                schema:description ?credentialDescription .
          FILTER(LANG(?credentialDescription) = "${lang}" || LANG(?credentialDescription) = "")
      
        }
        OPTIONAL {
          ?credential a schema:EducationalOccupationalCredential ;
                schema:startDate ?credentialStartDate .
          
        }
        OPTIONAL {
          ?credential a schema:EducationalOccupationalCredential ;
                schema:endDate ?credentialEndDate .
        }
      } ORDER BY  DESC(?credentialStartDate)
    `;
    if (variant) {
      credentialsQuery = `
        PREFIX sc: <https://schema.org/>
        PREFIX schema: <https://schema.org/>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        prefix elm: <https://data.europa.eu/snb/elm/>
        
        SELECT

            ?credential ?credentialName ?credentialDescription ?credentialIdentifier ?credentialStartDate ?credentialEndDate
        WHERE {
          ${subject} ${attribute} ?credential .
          OPTIONAL {
                ?credential a schema:EducationalOccupationalCredential ;
                    schema:name ?credentialName .
              FILTER(LANG(?credentialName) = "${lang}" || LANG(?credentialName) = "")         
            OPTIONAL {
                ?credential a schema:EducationalOccupationalCredential ;
                    schema:name ?credentialNameTerm .
                ?credentialNameTerm a schema:DefinedTerm ;
                  schema:inDefinedTermSet ${variant};
                    schema:name ?credentialName .
              FILTER(LANG(?credentialName) = "${lang}" || LANG(?credentialName) = "")
            }
          }
          OPTIONAL {
            ?credential a schema:EducationalOccupationalCredential ;
                  schema:description ?credentialDescriptionTerm .
            ?credentialDescriptionTerm a schema:DefinedTerm ;
                schema:inDefinedTermSet ${variant} ;
                schema:description ?credentialDescription .
            FILTER(LANG(?credentialDescription) = "${lang}" || LANG(?credentialDescription) = "")
        
          }
          OPTIONAL {
            ?credential a schema:EducationalOccupationalCredential ;
                  schema:startDate ?credentialStartDate .
            
          }
          OPTIONAL {
            ?credential a schema:EducationalOccupationalCredential ;
                  schema:endDate ?credentialEndDate .
          }
        } ORDER BY  DESC(?credentialStartDate)
      `;
    }
    try {
      // console.log(credentialsQuery);
       result = (store?.query(credentialsQuery) as unknown as Map<string, Term>[]).map(mapToObject) as ICredentialDetails[];
      } catch(e) { // silent fail
        console.error(e);
      }
    return result;
}