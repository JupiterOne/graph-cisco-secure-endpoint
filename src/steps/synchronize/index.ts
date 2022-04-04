import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { createServicesClient } from '../../collector';
import { IntegrationConfig } from '../../config';
import {
  convertComputer,
  createAccountEntity,
  mapEndpointProtectionRelationship,
} from '../../converter';
import { Entities, MappedRelationships, Relationships } from '../constants';

const step: IntegrationStep<IntegrationConfig> = {
  id: 'synchronize',
  name: 'Fetch Cisco AMP entities',
  entities: [Entities.ACCOUNT, Entities.COMPUTER],
  relationships: [Relationships.ACCOUNT_HAS_ENDPOINT],
  mappedRelationships: [MappedRelationships.ENDPOINT_PROTECTS_DEVICE],
  executionHandler: synchronize,
};

export async function synchronize({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>): Promise<void> {
  const client = createServicesClient(instance);
  const accountEntity = await jobState.addEntity(
    createAccountEntity({
      id: instance.id,
      name: instance.name,
      description: instance.description,
    }),
  );
  const computers = await client.iterateComputers();
  const computerEntities = computers.map(convertComputer);
  await jobState.addEntities(computerEntities);

  const accountComputerRelationships = computerEntities.map((computerEntity) =>
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
}

export default step;
