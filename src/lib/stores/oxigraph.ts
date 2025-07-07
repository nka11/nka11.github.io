// src/lib/stores/oxygraph.ts
import { writable } from 'svelte/store';
import wasmUrl from 'oxigraph/web_bg.wasm?url';
 import init, { Store } from 'oxigraph';
export const oxigraphStore = writable<{ store: any | null; oxiReady: boolean }>({
  store: null,
  oxiReady: false
});

export async function initOxigraph() {
  if (typeof window === 'undefined') return; // 🔒 Protection SSG

  await init(wasmUrl);
  const store = new Store();
  const turtleUrl = '/cv_schemaorg.ttl';
  // Charger le fichier .ttl (ex: CV)
  const turtleText = await fetch(turtleUrl).then((res) => res.text());

  // Charger les triples dans le store RDF
  store.load(turtleText, {format: 'text/turtle'}); 
  oxigraphStore.set({ store, oxiReady: true });
}

export function mapToObject(map: Map<string, any>): Record<string, any> {
    const obj: Record<string, any> = {};
    for (const [key, value] of map.entries()) {
        obj[key] = value;
    }
    return obj;
  }