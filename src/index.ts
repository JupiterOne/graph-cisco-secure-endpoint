import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { instanceConfigFields, IntegrationConfig } from './config';
import { integrationSteps } from './steps';

import validateInvocation from './validateInvocation';

export const invocationConfig: IntegrationInvocationConfig<IntegrationConfig> = {
  instanceConfigFields,
  validateInvocation,
  integrationSteps,
};
