import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { instanceConfigFields, IntegrationConfig } from './config';
import { getStepStartStates } from './getStepStartStates';
import { integrationSteps } from './steps';

import validateInvocation from './validateInvocation';

export const invocationConfig: IntegrationInvocationConfig<IntegrationConfig> = {
  instanceConfigFields,
  getStepStartStates,
  validateInvocation,
  integrationSteps,
};
