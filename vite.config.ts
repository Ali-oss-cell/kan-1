import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  ssr: {
    resolve: {
      conditions: ["module-sync", "module", "browser", "import", "default"],
      externalConditions: ["module-sync", "module", "import", "default"],
    },
  },
});
