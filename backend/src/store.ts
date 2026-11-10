import { readFileSync, writeFileSync } from "node:fs";

/**
 * Une toute petite « base de données » : un fichier JSON du dossier `data/`,
 * lu au démarrage et réécrit à chaque modification.
 *
 * C'est volontairement naïf (pas de transactions, pas de concurrence) : ça
 * suffit largement pour le TP, et ça évite d'installer un vrai SGBD.
 */
export function createStore<T>(fileName: string) {
  const file = new URL(`../data/${fileName}`, import.meta.url);
  let items: T[] = JSON.parse(readFileSync(file, "utf-8"));

  return {
    /** Tous les éléments stockés. */
    all(): T[] {
      return items;
    },

    /** Remplace le contenu du store et l'écrit sur le disque. */
    save(next: T[]): void {
      items = next;
      writeFileSync(file, `${JSON.stringify(next, null, 2)}\n`);
    },
  };
}
