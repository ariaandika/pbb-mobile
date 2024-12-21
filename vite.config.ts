import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  define: { APP: `"browser"` },
  server: {
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
  plugins: [svelte(),tailwindcss(),{
    name: "remote-logger",
    configureServer(server) {
      server.ws.on("app:log", (data) => {
        console.log(data)
      })
      server.ws.on("app:err", (data) => {
        console.log("[ERROR]",data)
      })
    },
  }],
})
