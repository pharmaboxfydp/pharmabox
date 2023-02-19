import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    }
  },
  env: {
    BASE_URL: 'http://localhost:3000',
    BASE_API_URL: 'http://localhost:3000/api/'
  }
})
