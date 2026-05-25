import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  // This ensures variables from .env files AND process.env are available
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react(), tailwindcss(), viteSingleFile()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    define: {
      // Explicitly inject the Vercel API token into the client build
      // This guarantees the token is available instantly to the deployment script
      'import.meta.env.VITE_VERCEL_API_TOKEN': JSON.stringify(
        env.VITE_VERCEL_API_TOKEN || process.env.VITE_VERCEL_API_TOKEN || ''
      )
    }
  };
});
