// src/lib/stores/oxygraph.ts
import { writable } from 'svelte/store';
import wasmUrl from 'oxigraph/web_bg.wasm?url';
 import init, { Store, type Term } from 'oxigraph';
export const oxigraphStore = writable<{ store: Store | null; oxiReady: boolean }>({
  store: null,
  oxiReady: false
});

export async function initOxigraph() {
  if (typeof window === 'undefined') return; // 🔒 Protection SSG

  // @ts-ignore
  await init(wasmUrl);
  const store = new Store();
  const turtleUrls = [
    '/cv/schemaorg.ttl',
    '/cv/skills.ttl',
    '/cv/projects.ttl'
  ]

  // Charger le fichier .ttl (ex: CV)
  await Promise.all(
    turtleUrls.map(async (turtleUrl) => {
      await loadTurtleFile(turtleUrl, store);
    })
  );
  
  oxigraphStore.set({ store, oxiReady: true });
  console.log("Semantic store ready");
}

async function loadTurtleFile(turtleUrl: string, store: init.Store) {
  const turtleText = await fetch(turtleUrl).then((res) => res.text());
  console.log(`successfuly fetched data '${turtleUrl}'`);
  // Charger les triples dans le store RDF
  store.load(turtleText, { format: 'text/turtle' });
  console.log(`successfuly loaded semantic data '${turtleUrl}'`);
}

export function mapToObject(map: Map<string, Term>): unknown {
    const obj: Record<string, Term> = {};
    for (const [key, value] of map.entries()) {
        obj[key] = value;
    }
    return obj;
  }