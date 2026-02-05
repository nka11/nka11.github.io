// src/lib/stores/oxygraph.ts
import { writable } from 'svelte/store';
import wasmUrl from 'oxigraph/web_bg.wasm?url';
 import init, { Store, type Term } from 'oxigraph';
import type { IOrganizationRole } from './models';
export const oxigraphStore = writable<{ store: Store | null; oxiReady: boolean }>({
  store: null,
  oxiReady: false
});
export // tool to compare experience dates to sort
  function compareExperience(exp1: IOrganizationRole, exp2: IOrganizationRole) {
    // Primary sort: startDate descending (most recent first)
    const start1 = exp1.startDate?.value ?? '';
    const start2 = exp2.startDate?.value ?? '';
    if (start1 > start2) return -1;
    if (start1 < start2) return 1;
    // Secondary sort: endDate descending
    const end1 = exp1.endDate?.value ?? '';
    const end2 = exp2.endDate?.value ?? '';
    if (end1 > end2) return -1;
    if (end1 < end2) return 1;
    return 0;
  }
export async function initOxigraph(dataFiles: string[]) {
  if (typeof window === 'undefined') return; // 🔒 Protection SSG

  // @ts-ignore
  await init(wasmUrl);
  const store = new Store();


  // Charger le fichier .ttl (ex: CV)
  await Promise.all(
    dataFiles.map(async (turtleUrl) => {
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