import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0", // allow access from any host
    allowedHosts: ["dda5f1c03bee.ngrok-free.app"],
    port: 5173, // optional: specify dev server port
    strictPort: true,
    cors: true,
  },
});
