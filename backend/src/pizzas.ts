import { createStore } from "./store.js";

export type Pizza = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
};

const store = createStore<Pizza>("pizzas.json");

export function findAllPizzas(): Pizza[] {
  return store.all();
}

// 👉 Étape 1 : findPizzaById(id) — renvoie la pizza ou undefined

// 👉 Étape 2 : createPizza / updatePizza / deletePizza
//    Pensez à appeler store.save(...) pour persister vos changements.
