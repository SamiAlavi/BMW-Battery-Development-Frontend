import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Configure the dev server
  server: {
    host: '0.0.0.0', // Expose the server to other devices on the network
    port: 5173,
    open: true, // Open the browser automatically when server starts
  },
})
