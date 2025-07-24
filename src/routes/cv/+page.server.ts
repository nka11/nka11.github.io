import * as fs from 'fs';
import * as rdfParse from 'rdf-parse';
import { Readable } from 'stream';
import { JsonLdSerializer } from 'jsonld-streaming-serializer';
import type { IVariantsDetails } from '$lib/semcv/models';
import { mapToObject } from '$lib/semcv/semantic_cv_store.js';

import { Store, type Term } from 'oxigraph';
import { VARIANT_PREFIX, variantsQuery } from '$lib/semcv/adapters/variantsAdapter';
import { dataFiles } from '$lib/semcv/cv_data_files';

const store = new Store();


dataFiles.map((turtleUrl) => {
  const turtlePath = `./static${turtleUrl}`;

  const turtleString = fs.readFileSync(turtlePath,'utf8');  
  console.log(`Loading ${turtlePath}`)
  store.load(turtleString, { format: 'text/turtle' });
  // const quadStream = rdfParse.rdfParser.parse(
  //   Readable.from([turtleString]),
  //   { contentType: 'text/turtle' }
  // );
});

const results = (store?.query(variantsQuery) as unknown as Map<string, Term>[]).map(mapToObject) as IVariantsDetails[];

// +page.server.ts

export async function load() {
  let data:any;
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
