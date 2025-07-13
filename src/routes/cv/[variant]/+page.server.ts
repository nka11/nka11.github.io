export const prerender = true;

import type { IVariantsDetails } from '$lib/semcv/models';
import { mapToObject } from '$lib/semcv/semantic_cv_store.js';
import * as fs from 'fs';

import { Store, type Term } from 'oxigraph';

const store = new Store();

const dataFiles = [
      '/cv/schemaorg.ttl',
      '/cv/skills.ttl',
      '/cv/projects.ttl',
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
const PREFIX = "https://nka11.github.io/cv#";
const variantsQuery = `
      PREFIX schema: <https://schema.org/>
      PREFIX : <https://nka11.github.io/cv#> 
      
      SELECT ?variant ?name
      WHERE {
        ?variant a schema:DefinedTermSet ;
            schema:name ?name .
      }
      `
      const results = (store?.query(variantsQuery) as unknown as Map<string, Term>[]).map(mapToObject) as IVariantsDetails[];
    

export async function entries() {
  console.log(results);
  const variants = results.map((variant) => {
      return { variant: variant.variant.value.slice(PREFIX.length) };
    })

  return variants;
}

export async function load({ params }: any) {
  let data:any;
    

    
  results.forEach((variant) => {
    console.log(variant.variant);
    if (variant.variant === params.variant) {
      return {
        metadata: variant, // ✅ uniquement des données sérialisables
        variant: variant.variant.value // pour construire le path d’import dynamique
      };
    }
  })
    
  }


