import { IntegrationExecutionContext } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from './config';
import { Steps } from './steps/constants';

export function getStepStartStates(
  executionContext: IntegrationExecutionContext<IntegrationConfig>,
) {
  const findingsDisabled =
    executionContext.instance.config.disableFindingsStep ?? true;

  return {
    [Steps.SYNCHRONIZE]: { disabled: false },
    [Steps.FINDINGS]: {
      disabled: findingsDisabled,
    },
  };
}
