import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  resolve: {
    alias: {
      // Fix for buffer polyfill needed by ethers.js
      buffer: 'buffer',
    },
  },
  define: {
    // Required for some dependencies
    'process.env': {},
    global: 'globalThis',
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
    },
    include: ['keccak', 'fetch-retry'],
    exclude: ['@zama-fhe/relayer-sdk'],
  },

})
