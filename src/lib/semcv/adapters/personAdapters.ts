
import { Literal, NamedNode, BlankNode, type Term } from "oxigraph"
import type { IPersonDetails, ISkillsDetails } from "../models";
import { mapToObject, oxigraphStore } from "../semantic_cv_store";
import { get } from "svelte/store";

export function getPerson(subject: NamedNode, lang: string = "fr", variant: NamedNode | undefined = undefined ): IPersonDetails {
    //schema:inDefinedTermSet
    // let result: IPersonDetails | undefined = undefined;

    let predicate = `
    schema:jobTitle ?jobTitle .
        FILTER(LANG(?jobTitle) = "${lang}" || LANG(?jobTitle) = "")
    OPTIONAL {
      ${subject} a schema:Person ;
          schema:description ?description.
      FILTER(LANG(?description) = "${lang}" || LANG(?description) = "")
    }
    
        `;
    if (variant) {
      predicate = `
      schema:jobTitle ?jobTitleTerm .
        ?jobTitleTerm a schema:DefinedTerm ;
              schema:inDefinedTermSet ${variant};
              schema:name ?jobTitle .
      FILTER(LANG(?jobTitle) = "${lang}" || LANG(?jobTitle) = "")
      OPTIONAL {
        ?jobTitleTerm a schema:DefinedTerm ;
              schema:inDefinedTermSet ${variant};
              schema:description ?description.
      FILTER(LANG(?description) = "${lang}" || LANG(?description) = "")
    }
      `
    }

    const { store, oxiReady } = get(oxigraphStore);
      if (!oxiReady) {
        throw "PersonAdapter: semantic store not ready"
    }
    const personQuery = `
      PREFIX schema: <https://schema.org/>
      SELECT ?name ?jobTitle ?description ?lang
      WHERE {
        ${subject} a schema:Person ;
                schema:name ?name ;
        ${predicate}
      }
    `;
    console.log(personQuery);
    try {
        const results = (store?.query(personQuery) as unknown as Map<string, Term>[]).map(mapToObject) as IPersonDetails[];
        if (results.length == 1) {
          let result: IPersonDetails = {...results[0], person: subject} ;
          return result;
        } else {
          throw `Entity not found or not unique (length ${results.length})`;
        }
      } catch(e) { // silent fail
        throw e;
      }
}