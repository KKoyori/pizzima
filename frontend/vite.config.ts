import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Le front appelle "/api/pizzas", Vite relaie vers l'API Express.
      // Résultat : pas de problème de CORS, et la même URL qu'en production.
      "/api": "http://localhost:8080",
    },
  },
});
