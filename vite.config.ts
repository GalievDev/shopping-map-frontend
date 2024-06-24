import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: 'https://shopping-map-frontend-ise25-5f97224d314d73e3900ccd050e8a25f1f49.pages.pg.innopolis.university/'
})
