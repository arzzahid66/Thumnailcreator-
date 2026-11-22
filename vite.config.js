import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base: './'` keeps the build working on GitHub Pages project sites
// (https://<user>.github.io/<repo>/) as well as custom domains / root hosting.
export default defineConfig({
  plugins: [react()],
  base: './',
})
