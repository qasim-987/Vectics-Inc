import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change this to your GitHub repository name when you publish.
const REPO_NAME = 'shelf'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves the site from https://<user>.github.io/<repo>/
  base: `/${REPO_NAME}/`,
})
