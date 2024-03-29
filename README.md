# graph-cisco-secure-endpoint

## Development Environment

### Prerequisites

You must have Node.JS installed to run this project. If you don't already have
it installed, you can can download the installer
[here](https://nodejs.org/en/download/). You can alternatively install Node.JS
using a version manager like [fnm](https://github.com/Schniz/fnm) or
[nvm](https://github.com/nvm-sh/nvm).

### Setup

#### Installing dependencies

From the root of this project, run `npm install` to install dependencies. If you
have `yarn` installed, you can install dependencies by running `yarn`.

#### Loading credentials

Create a `.env` file at the root of this project and add environment variables
to match what is in `src/instanceConfigFields.json`. The `.env` file is ignored
by git, so you won't have to worry about accidentally pushing credentials.

Given this example configuration:

```json
{
  "apiEndpoint": {
    "type": "string"
  },
  "apiClientId": {
    "type": "string"
  },
  "apiKey": {
    "type": "string",
    "mask": true
  }
}
```

You would provide a `.env` file like this:

```bash
API_ENDPOINT=<endpoint_hostname>
API_CLIENT_ID=<client-id>
API_KEY=<secret>
```

Valid API Endpoints for Cisco Secure Endpoint include:

- api.amp.cisco.com
- api.apjc.amp.cisco.com
- api.eu.amp.cisco.com

The snake cased environment variables will automatically be converted and
applied to the camel cased configuration field. So for example, `CLIENT_ID` will
apply to the `clientId` config field, `CLIENT_SECRET` will apply to
`clientSecret`, and `MY_SUPER_SECRET_CONFIGURATION_VALUE` will apply to a
`mySuperSecretConfigurationValue` configuration field.

## Running the integration

To start collecting data, run `yarn start` from the root of the project. This
will load in your configuration and execute the steps stored in `src/steps`.

## Project structure

This is the expected project structure for running integrations.

```
src/
  /instanceConfigFields.json
  /validateInvocation.ts
  /getStepStartStates.ts
  steps/
    exampleStep.ts
    // add additional steps here
```

Each of the files listed above contribute to creating an
[integration configuration](https://github.com/JupiterOne/integration-sdk/blob/master/docs/development.md#the-integration-framework).

Additional files can be placed under `src` and referenced from each of the
integration files.

The template project hosted
[here](https://github.com/JupiterOne/integration-sdk/tree/master/template)
provides a simple example of how an integration can be setup.

## Development Docs

Please reference the `@jupiterone/integration-sdk`
[development documentation](https://github.com/JupiterOne/integration-sdk/blob/master/docs/development.md)
for more information on how to build integrations.
