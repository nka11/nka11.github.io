export const prerender = true;

import type { IVariantsDetails } from '$lib/semcv/models';
import { mapToObject } from '$lib/semcv/semantic_cv_store.js';
import * as fs from 'fs';

import { Store, type Term } from 'oxigraph';

const store = new Store();
const VARIANT_PREFIX = "https://nka11.github.io/cv#variant-";

const dataFiles = [
      '/cv/schemaorg.ttl',
      '/cv/skills.ttl',
      '/cv/projects.ttl',
      '/cv/product_cycle.ttl',
    ]


dataFiles.map((turtleUrl) => {
  const turtlePath = `./static${turtleUrl}`;

  const turtleString = fs.readFileSync(turtlePath,'utf8');  
  store.load(turtleString, { format: 'text/turtle' });
  // const quadStream = rdfParse.rdfParser.parse(
  //   Readable.from([turtleString]),
  //   { contentType: 'text/turtle' }
  // );
});
const variantsQuery = `
      PREFIX schema: <https://schema.org/>
      
      SELECT ?variant ?name
      WHERE {
        ?variant a schema:DefinedTermSet ;
            schema:name ?name .
      }
      `
const results = (store?.query(variantsQuery) as unknown as Map<string, Term>[]).map(mapToObject) as IVariantsDetails[];

console.log(results)

export async function entries() {
  console.log(results);
  const variants = results.map((variant) => {
      return { 
        variant: variant.variant.value.slice(VARIANT_PREFIX.length),
        name: variant.name?.value
      };
    })

  return variants;
}

export async function load({ params }: any) {
  let data:any;
  console.log(params)
  results.forEach((variant) => {
    console.log(variant.variant.value);
    console.log(params.variant);
    console.log(variant.variant.value.endsWith(params.variant));
    if (variant.variant.value.endsWith(params.variant)) {
      data = {
        dataFiles: dataFiles,
        metadata: variant.variant.value, // ✅ uniquement des données sérialisables
        variant: variant.variant.value.slice(VARIANT_PREFIX.length) // pour construire le path d’import dynamique
      };
    }
  })
  return data;
  }


