const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      token: 'lorem',
      email: null,
      password: null,
    },
    baseUrl: "https://secondhand.binaracademy.org/",
  },
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports', // directory to store reports
    overwrite: false, // keeps old reports by not overwriting files
    html: true, // generates an HTML report
    json: true, // generates a JSON report
  },
});
