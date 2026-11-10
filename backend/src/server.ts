import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import { findAllPizzas, findPizzaById } from "./pizzas.js";

const PORT = 8080;

const app = express();

// Le front tourne sur un autre port (5173) : sans CORS, le navigateur
// bloquerait les appels. On en reparle dans la séance sécurité.
app.use(cors());
app.use(express.json());

app.get("/api/pizzas", (request, response) => {
  let pizzas = findAllPizzas();
  const search = request.query.search;

  if (typeof search === "string" && search.trim() !== "") {
    const query = search.toLowerCase();
    pizzas = pizzas.filter((pizza) =>
      pizza.name.toLowerCase().includes(query)
    );
  }

  return response.json(pizzas);
});

// 👉 Étape 1 : GET /api/pizzas/:id
app.get("/api/pizzas/:id", (request, response) => {
  // 1. Récupérer le paramètre : request.params.id
  const rawId = request.params.id;
  // 2. ⚠️ C'est une chaîne de caractères ! Number(...) pour le convertir.
  const id = Number(rawId);
  // 3. Chercher la pizza.
  const pizza = findPizzaById(id);

  if (isNaN(id)) {
    return response.status(400).json({ message: "L'id fourni est invalide." });
  }
  // 4. Introuvable ➡️ 404 avec un message. Trouvée ➡️ response.json(pizza).
  if (!pizza) {
    return response.status(404).json({ message: "Pizza non trouvée." });
  }

  return response.json(pizza);
});

// 👉 Étape 2 : POST, PUT et DELETE sur /api/pizzas
// 👉 Étape 4 : POST /api/orders

// Aucune route n'a répondu : c'est un 404.
app.use((request, response) => {
  response.status(404).json({ error: `Route inconnue : ${request.originalUrl}` });
});

// Express 5 attrape aussi les erreurs des handlers async et les envoie ici.
const handleError: ErrorRequestHandler = (error, request, response, next) => {
  console.error(error);
  response.status(500).json({ error: "Erreur serveur" });
};
app.use(handleError);

app.listen(PORT, () => {
  console.log(`🍕 API Pizzima sur http://localhost:${PORT}/api/pizzas`);
});
