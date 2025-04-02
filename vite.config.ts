import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base:"/luxfood_",
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Enable importing CSV files
  assetsInclude: ['**/*.csv'],
});