import { IntegrationConfig } from '../../types';

import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { createServicesClient } from '../../collector';
import {
  convertComputer,
  ENDPOINT_PROTECTION_RELATIONSHIP,
  mapEndpointProtectionRelationship,
} from '../../converter';

const step: IntegrationStep<IntegrationConfig> = {
  id: 'synchronize',
  name: 'Fetch Cisco AMP entities',
  entities: [
    {
      resourceName: 'Account',
      _type: 'cisco_amp_account',
      _class: 'Account',
    },
    {
      resourceName: 'Computer',
      _type: 'cisco_amp_endpoint',
      _class: 'HostAgent',
    },
  ],
  relationships: [
    {
      _type: 'cisco_amp_account_has_endpoint',
      sourceType: 'cisco_amp_account',
      _class: RelationshipClass.HAS,
      targetType: 'cisco_amp_endpoint',
    },
    {
      _type: ENDPOINT_PROTECTION_RELATIONSHIP,
      sourceType: 'cisco_amp_endpoint',
      _class: RelationshipClass.PROTECTS,
      targetType: 'user_endpoint',
    },
  ],
  async executionHandler({ instance, jobState }) {
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
        createDirectRelationship({
          from: accountEntity,
          to: computerEntity,
          _class: RelationshipClass.HAS,
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
