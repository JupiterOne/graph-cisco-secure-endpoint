import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { instanceConfigFields, IntegrationConfig } from './config';

import synchronize from './steps/synchronize';
import validateInvocation from './validateInvocation';

export const invocationConfig: IntegrationInvocationConfig<IntegrationConfig> = {
  instanceConfigFields,
  validateInvocation,
  integrationSteps: [synchronize],
};
