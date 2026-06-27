import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// standard Vite + React setup, nothing fancy here
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
