import { defineConfig } from 'cypress'
import * as dotenv from 'dotenv'
dotenv.config()

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here

      return config
    },
    baseUrl: 'http://localhost:3000'
  },
  env: {
    BASE_API_URL: 'http://localhost:3000/api/'
  }
})
