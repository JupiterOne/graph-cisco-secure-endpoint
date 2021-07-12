import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';
import { IntegrationConfig } from '../src/types';

export function createStepContext() {
  return createMockStepExecutionContext<IntegrationConfig>({
    instanceConfig: {
      apiEndpoint: process.env.API_ENDPOINT || 'api.amp.cisco.com',
      apiClientId: process.env.API_CLIENT_ID || 'test',
      apiKey: process.env.API_KEY || 'test',
    },
  });
}
