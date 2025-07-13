import type { NamedNode, Term } from "oxigraph";
import { get } from "svelte/store";
import { mapToObject, oxigraphStore } from "../semantic_cv_store";
import type { IPersonLangDetails, IVariantsDetails } from "../models";


export function listPersonVariants(subject: NamedNode, lang: string = "fr" ): IVariantsDetails[] {
    
    // let result: IPersonDetails | undefined = undefined;
    const { store, oxiReady } = get(oxigraphStore);
      if (!oxiReady) {
        throw "VariantAdapter: semantic store not ready"
    }
    let results:IVariantsDetails[] = [];
    const langQuery = `
      PREFIX schema: <https://schema.org/>
      SELECT ?lang ?level
      WHERE {
        ${subject} a schema:Person ;
            schema:knowsLanguage ?langref .
        ?langref a schema:Language ;
            schema:name ?lang ;
            schema:description ?level .
        FILTER(LANG(?lang) = "${lang}" || LANG(?lang) = "")
        FILTER(LANG(?level) = "${lang}" || LANG(?level) = "")
      }
    `;
    try {
        console.log(langQuery)
        results = (store?.query(langQuery) as unknown as Map<string, Term>[]).map(mapToObject) as IVariantsDetails[];
        console.log(results)
        } catch(e) {
        throw e;
      }
    return results;
}