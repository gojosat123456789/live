import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const page = (name: string) => fileURLToPath(new URL(`./${name}.html`, import.meta.url))

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: page('index'),
        about: page('about'),
        skills: page('skills'),
        projects: page('projects'),
        services: page('services'),
        experience: page('experience'),
        contact: page('contact'),
        resume: page('resume'),
      },
    },
  },
})
