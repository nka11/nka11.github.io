import * as fs from 'fs';
import * as rdfParse from 'rdf-parse';
import { Readable } from 'stream';
import { JsonLdSerializer } from 'jsonld-streaming-serializer';
import type { IVariantsDetails } from '$lib/semcv/models';
import { mapToObject } from '$lib/semcv/semantic_cv_store.js';

import { Store, type Term } from 'oxigraph';

const store = new Store();
const VARIANT_PREFIX = "https://nka11.github.io/cv#variant-";

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
const variantsQuery = `
      PREFIX schema: <https://schema.org/>
      
      SELECT ?variant ?name
      WHERE {
        ?variant a schema:DefinedTermSet ;
            schema:name ?name .
      }
      `
const results = (store?.query(variantsQuery) as unknown as Map<string, Term>[]).map(mapToObject) as IVariantsDetails[];

// +page.server.ts

export async function load() {
  let data:any;
  const dataFiles = [
    '/cv/schemaorg.ttl',
    '/cv/skills.ttl',
    '/cv/projects.ttl',
  ]
dataFiles.map((turtleUrl) => {
  const turtlePath = `./static${turtleUrl}`;

  const turtleString = fs.readFileSync(turtlePath,'utf8');  

  const quadStream = rdfParse.rdfParser.parse(
      Readable.from([turtleString]),
      { contentType: 'text/turtle' }
    );
  });
  const variants = results.map((variant) => {
      return { 
        variant: variant.variant.value.slice(VARIANT_PREFIX.length),
        name: variant.name?.value
      };
    })
  const serializer = new JsonLdSerializer();
  // const jsonldStream = serializer.import(quadStream);

  // 4. Récupérer les données JSON-LD en texte
  let jsonld = '';
  // for await (const chunk of jsonldStream) {
  //   jsonld += chunk;
  // }
  // console.log(jsonld);
  // data = JSON.parse(jsonld);
  return {
    jsonld:data,
    dataFiles: dataFiles,
    variants: variants
  };
}
