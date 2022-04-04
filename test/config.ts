import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { StepTestConfig } from '@jupiterone/integration-sdk-testing';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { invocationConfig } from '../src';
import { IntegrationConfig } from '../src/config';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}

const DEFAULT_API_ENDPOINT = 'api.amp.cisco.com';
const DEFAULT_API_CLIENT_ID = ' test';
const DEFAULT_API_KEY = 'test';

export const integrationConfig: IntegrationConfig = {
  apiEndpoint: process.env.API_ENDPOINT || DEFAULT_API_ENDPOINT,
  apiClientId: process.env.API_CLIENT_ID || DEFAULT_API_CLIENT_ID,
  apiKey: process.env.API_KEY || DEFAULT_API_KEY,
};

export function buildStepTestConfigForStep(stepId: string): StepTestConfig {
  return {
    stepId,
    instanceConfig: integrationConfig,
    invocationConfig: invocationConfig as IntegrationInvocationConfig,
  };
}
