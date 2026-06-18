// @ts-check

require('dotenv').config()

const { defineConfig, devices } = require('@playwright/test')
const isHeadless = process.env.HEADLESS
  ? process.env.HEADLESS.toLowerCase() === 'true'
  : !!process.env.CI

module.exports = defineConfig({

  testDir: './tests',

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: 'html',


  use: {

    baseURL: process.env.BASE_URL,

    headless: isHeadless,

    trace: 'on',

    screenshot: 'only-on-failure'
  },

  projects: [

    {
      name: 'setup',

      testMatch: /.*auth\.setup\.js/,

      use: {
        ...devices['Desktop Chrome']
      }
    },

    {
      name: 'auth-tests',

      testMatch: /.*auth.*\.spec\.js/,

      use: {
        ...devices['Desktop Chrome']
      }
    },

    {
      name: 'e2e-tests',

      dependencies: ['setup'],

      testMatch: /.*(inventory|checkout).*\.spec\.js/,

      use: {

        ...devices['Desktop Chrome'],

        storageState: 'playwright/.auth/user.json'
      }
    },

    {
      name: 'e2e-tests-firefox',
      dependencies: ['setup'],
      testMatch: /.*(inventory|checkout).*\.spec\.js/,
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/user.json'
      }
    }

  ]
})