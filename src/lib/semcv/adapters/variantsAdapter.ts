import type { NamedNode, Term } from "oxigraph";
import { get } from "svelte/store";
import { mapToObject, oxigraphStore } from "../semantic_cv_store";
import type { IVariantsDetails } from "../models";
export const VARIANT_PREFIX = "https://nka11.github.io/cv#variant-";

export const variantsQuery = `
      PREFIX schema: <https://schema.org/>
      
      SELECT ?variant ?name
      WHERE {
        ?variant a schema:DefinedTermSet ;
            schema:name ?name .
      }
      `

export function listVariants(subject: NamedNode, lang: string = "fr" ): IVariantsDetails[] {
    
    // let result: IPersonDetails | undefined = undefined;
    const { store, oxiReady } = get(oxigraphStore);
      if (!oxiReady) {
        throw "VariantAdapter: semantic store not ready"
    }
    let results:IVariantsDetails[] = [];
    
    try {
          results = (store?.query(variantsQuery) as unknown as Map<string, Term>[]).map(mapToObject) as IVariantsDetails[];
        } catch(e) {
        throw e;
      }
    return results;
}