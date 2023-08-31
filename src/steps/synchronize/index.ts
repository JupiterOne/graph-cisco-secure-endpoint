import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { CiscoAmpComputer, createServicesClient } from '../../collector';
import { IntegrationConfig } from '../../config';
import {
  convertComputer,
  createAccountEntity,
  mapEndpointProtectionRelationship,
} from '../../converter';
import { Entities, MappedRelationships, Relationships } from '../constants';

export const synchronizeSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: 'synchronize',
    name: 'Fetch Cisco AMP entities',
    entities: [Entities.ACCOUNT, Entities.COMPUTER],
    relationships: [Relationships.ACCOUNT_HAS_ENDPOINT],
    mappedRelationships: [MappedRelationships.ENDPOINT_PROTECTS_DEVICE],
    executionHandler: synchronize,
  },
];

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

  await client.iterateComputers(async (computer: CiscoAmpComputer) => {
    const computerEntity = convertComputer(computer);
    if (jobState.hasKey(computerEntity._key)) {
      return;
    }
    await jobState.addEntity(computerEntity);
    await jobState.addRelationship(
      createDirectRelationship({
        from: accountEntity,
        to: computerEntity,
        _class: RelationshipClass.HAS,
      }),
    );

    await jobState.addRelationship(
      mapEndpointProtectionRelationship(computerEntity),
    );
  });
}
