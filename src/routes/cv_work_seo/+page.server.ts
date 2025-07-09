import * as fs from 'fs';
import * as rdfParse from 'rdf-parse';
import { Readable } from 'stream';
import { JsonLdSerializer } from 'jsonld-streaming-serializer';
// +page.server.ts
export async function load() {
  let data:any;

  const turtlePath = './static/cv/schemaorg.ttl';

  const turtleString = fs.readFileSync(turtlePath,'utf8');  

const quadStream = rdfParse.rdfParser.parse(
  Readable.from([turtleString]),
  { contentType: 'text/turtle' }
);
const serializer = new JsonLdSerializer();
const jsonldStream = serializer.import(quadStream);

// 4. Récupérer les données JSON-LD en texte
let jsonld = '';
  for await (const chunk of jsonldStream) {
    jsonld += chunk;
  }
  console.log(jsonld);
  data = JSON.parse(jsonld);
  return {jsonld:data};
}
