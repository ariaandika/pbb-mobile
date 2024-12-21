import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;
console.log("isTauri", host)

// https://vite.dev/config/
export default defineConfig({
  define: { APP: host ? `"tauri"` : `"browser"` },
  server: {
    host,
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
    }
  }],
})
