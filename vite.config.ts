import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    // Base path is essential for GitHub Pages (usually /repo-name/)
    // Setting it to './' makes it relative and works in most static hosts.
    base: './', 
    define: {
      // Polyfill process.env.API_KEY so the existing code works without modification
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Prevent other process.env access from crashing
      'process.env': {}
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    }
  };
});