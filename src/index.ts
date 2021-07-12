import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';

import synchronize from './steps/synchronize';
import { IntegrationConfig } from './types';
import validateInvocation from './validateInvocation';

export const invocationConfig: IntegrationInvocationConfig<IntegrationConfig> = {
  instanceConfigFields: {
    apiEndpoint: {
      type: 'string',
    },
    apiClientId: {
      type: 'string',
    },
    apiKey: {
      type: 'string',
      mask: true,
    },
  },
  validateInvocation,
  integrationSteps: [synchronize],
};
