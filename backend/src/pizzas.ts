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
export function findPizzaById(id: number): Pizza | undefined {
  // Indice : store.all() vous donne le tableau, et find() est votre ami.
  return store.all().find((pizza) => pizza.id === id);
}

// 👉 Étape 2 : createPizza / updatePizza / deletePizza
//    Pensez à appeler store.save(...) pour persister vos changements.

export function createPizza(pizza: Omit<Pizza, "id">): Pizza {
  // Générer un id (indice : le plus grand id existant + 1, et 1 si le store est vide)
  // Ajouter la pizza, appeler store.save(...), retourner la pizza créée
  const pizzas = store.all();

  const maxId = pizzas.reduce((max, item) => (item.id > max ? item.id : max), 0);
  const newPizza: Pizza = {
    id: maxId + 1,
    ...pizza,
  };

  store.save([...pizzas, newPizza]);
  return newPizza;
}


export function updatePizza(id: number, pizza: Omit<Pizza, "id">): Pizza | undefined {
  // undefined si l'id n'existe pas
  const pizzas = store.all();
  const exists = pizzas.some((item) => item.id === id);

  if (!exists) {
    return undefined;
  }

  const updatedPizza: Pizza = { id, ...pizza };
  const nextPizzas = pizzas.map((item) => (item.id === id ? updatedPizza : item));

  store.save(nextPizzas);
  return updatedPizza;
}

export function deletePizza(id: number): boolean {
  // true si quelque chose a été supprimé, false sinon
  const pizzas = store.all();
  const nextPizzas = pizzas.filter((item) => item.id !== id);

  if (nextPizzas.length === pizzas.length) {
    return false;
  }

  store.save(nextPizzas);
  return true;
}

export function parsePizzaBody(body: unknown): Omit<Pizza, "id"> | null {
  if (
    typeof body === "object" &&
    body !== null &&
    "name" in body && typeof body.name === "string" && body.name.trim() !== "" &&
    "description" in body && typeof body.description === "string" &&
    "price" in body && typeof body.price === "number" && body.price > 0 &&
    "image" in body && typeof body.image === "string"
  ) {
    return {
      name: body.name.trim(),
      description: body.description,
      price: body.price,
      image: body.image,
    };
  }

  return null;
}
