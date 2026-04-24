import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const deployTag =
  process.env.VERCEL_GIT_COMMIT_SHA ||
  process.env.VERCEL_DEPLOYMENT_ID ||
  process.env.CI_COMMIT_SHA ||
  ""

export default defineConfig({
  define: {
    __PPF_DEPLOY_TAG__: JSON.stringify(deployTag),
  },
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_DEV_API_PROXY ?? "http://127.0.0.1:3000",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
