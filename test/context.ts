import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';

export function createStepContext(): ReturnType<
  typeof createMockStepExecutionContext
> {
  return createMockStepExecutionContext({
    instanceConfig: {
      apiEndpoint: process.env.API_ENDPOINT || 'api.amp.cisco.com',
      apiClientId: process.env.API_CLIENT_ID || 'test',
      apiKey: process.env.API_KEY || 'test',
    },
  });
}
