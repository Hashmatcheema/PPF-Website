import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
<<<<<<< HEAD
=======
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_DEV_API_PROXY ?? "http://127.0.0.1:3000",
        changeOrigin: true,
      },
    },
  },
>>>>>>> modifics
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
