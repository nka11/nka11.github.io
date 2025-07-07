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
  const turtleUrl = '/cv_schemaorg.ttl';
  // Charger le fichier .ttl (ex: CV)
  const turtleText = await fetch(turtleUrl).then((res) => res.text());
  console.log("successfuly fetched semantic data");
  // Charger les triples dans le store RDF
  store.load(turtleText, {format: 'text/turtle'}); 
  console.log("successfuly loaded semantic data");
  oxigraphStore.set({ store, oxiReady: true });
  console.log("Semantic store ready");
}

export function mapToObject(map: Map<string, Term>): unknown {
    const obj: Record<string, Term> = {};
    for (const [key, value] of map.entries()) {
        obj[key] = value;
    }
    return obj;
  }