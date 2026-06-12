import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Relative Pfade: funktioniert unter nuvio-labs.github.io/Tycoon/ UND einer Custom-Domain
  base: "./",
  plugins: [react(), tailwindcss()],
});