import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// Env is read from the repo-root .env (shared by all three apps).
const envDir = path.resolve(__dirname, "../..");

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, envDir, "");
  const port = Number(env.PRESIGNUP_V2_PORT ?? 6002);
  const proxy = {
    "/api": {
      target: env.API_PROXY_TARGET ?? "http://localhost:3000",
      changeOrigin: true,
      rewrite: (p: string) => p.replace(/^\/api/, ""),
    },
  };

  return {
    envDir,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { "@": path.resolve(__dirname, "./src") },
    },
    server: { port, strictPort: true, proxy },
    preview: { port, strictPort: true, proxy },
    build: { target: "ES2022", outDir: "dist" },
  };
});
