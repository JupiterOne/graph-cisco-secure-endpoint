import { IntegrationConfig } from '../../types';

import {
  createIntegrationRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { createServicesClient } from '../../collector';
import {
  convertComputer,
  ENDPOINT_PROTECTION_RELATIONSHIP,
  mapEndpointProtectionRelationship,
} from '../../converter';

const step: IntegrationStep = {
  id: 'synchronize',
  name: 'Fetch Cisco AMP entities',
  types: [
    'cisco_amp_account',
    'cisco_amp_endpoint',
    'cisco_amp_account_has_endpoint',
    ENDPOINT_PROTECTION_RELATIONSHIP,
  ],
  async executionHandler({
    instance,
    jobState,
  }: IntegrationStepExecutionContext<IntegrationConfig>) {
    const client = createServicesClient(instance);

    const accountEntity: Entity = {
      _key: `cisco_amp_account:${instance.id}`,
      _type: 'cisco_amp_account',
      _class: ['Account'],
      name: instance.name,
      displayName: instance.name,
      description: instance.description,
    };
    await jobState.addEntities([accountEntity]);

    const computers = await client.iterateComputers();
    const computerEntities = computers.map(convertComputer);
    await jobState.addEntities(computerEntities);

    const accountComputerRelationships = computerEntities.map(
      (computerEntity) =>
        createIntegrationRelationship({
          from: accountEntity,
          to: computerEntity,
          _class: 'HAS',
        }),
    );
    await jobState.addRelationships(accountComputerRelationships);

    const endpointProtectionRelationships = computerEntities.map(
      mapEndpointProtectionRelationship,
    );
    await jobState.addRelationships(endpointProtectionRelationships);
  },
};

export default step;
