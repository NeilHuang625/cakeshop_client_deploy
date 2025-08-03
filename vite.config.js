import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tailwindConfig from './tailwind.config.js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  console.log(`VITE_API_BASE_URL is: ${env.VITE_API_BASE_URL}`);
  

  return {
    plugins: [react(), tailwindcss(tailwindConfig)],
  };
});