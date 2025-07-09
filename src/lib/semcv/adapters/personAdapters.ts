
import { Literal, NamedNode, BlankNode, type Term } from "oxigraph"
import type { IPersonDetails, ISkillsDetails } from "../models";
import { mapToObject, oxigraphStore } from "../semantic_cv_store";
import { get } from "svelte/store";

export function getPerson(subject: NamedNode, lang: string = "fr" ): IPersonDetails {
    
    // let result: IPersonDetails | undefined = undefined;
    const { store, oxiReady } = get(oxigraphStore);
      if (!oxiReady) {
        throw "PersonAdapter: semantic store not ready"
    }
    const personQuery = `
      PREFIX schema: <https://schema.org/>
      SELECT ?name ?jobTitle ?lang
      WHERE {
        ${subject} a schema:Person ;
                schema:name ?name ;
                schema:jobTitle ?jobTitle .
        FILTER(LANG(?jobTitle) = "${lang}" || LANG(?jobTitle) = "")
      }
    `;
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