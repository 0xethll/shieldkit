import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    nodePolyfills({
      // To add only specific polyfills, add them here
      // If no option is passed, all polyfills are included
      include: ['buffer'],
      globals: {
        Buffer: true,
      },
    }),
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
