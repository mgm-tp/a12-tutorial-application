# Project Template - E2E

A minimal test suite created using [Playwright](https://playwright.dev/).

Our objective is to test a few core features of the template application, rather than the entire feature set provided by A12.

Therefore we have tests for:

- Logging in with the two users who come with the template.
- Creating a new person document.
- Updating a person document.
- Deleting a person document.

## Prerequisites

```bash
## install the dependencies
npm install
npm run e2e:install
```

Before you run the tests you'll need to have the application running/accessible. You can follow the instructions in the `client` readme file on how to accomplish this. Once running, you can update the `playwright.config.ts` file to point to the base path of your running application. In most cases you can leave it as the default `http://localhost:8081`.

## Running the tests

Running the tests via the interactive UI mode:

```bash
## launch the Playwight UI mode
npm run e2e:test-ui
```

Running the tests in the terminal:

```bash
## run the tests in headless mode
npm run e2e:test
```

You can also use `cross-env` to set the BASE_URL environment variable. This might be useful if you want to run the tests against a deployed version of the project in a CI context:

```bash
## run the tests in headless mode against a new baseUrl
npx cross-env BASE_URL=<YOUR-DEPLOYED-APPLICATION-URL> npm run e2e:test
```

## Showing the HTML report

```bash
npm run e2e:report
```