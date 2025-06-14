const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/integration/**/*.spec.js',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1920,
    viewportHeight: 1080,
    fixturesFolder: 'cypress/fixtures',
    downloadsFolder: 'cypress/downloads',
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    defaultCommandTimeout: 8000,
    screenshotOnRunFailure: true,
    trashAssetsBeforeRuns: true,
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,
      json: false
    }
  }
});