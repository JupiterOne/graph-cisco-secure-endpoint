import { createStepContext } from '../../../test';
import {
  executeStepWithDependencies,
  Recording,
} from '@jupiterone/integration-sdk-testing';

import step from './index';
import { setupCiscoAmpRecording } from '../../../test/recording';
import { buildStepTestConfigForStep } from '../../../test/config';
import {
  Entities,
  MappedRelationships,
  Relationships,
  Steps,
} from '../constants';

describe('syncronizeStep', () => {
  let recording: Recording;
  afterEach(async () => {
    await recording.stop();
  });

  describe('#fetchComputers', () => {
    test('should create account and computer entities and relationships', async () => {
      recording = setupCiscoAmpRecording({
        name: 'cisco_amp',
        directory: __dirname,
        redactedRequestHeaders: ['api-key'],
        options: {
          recordFailedRequests: false,
          matchRequestsBy: {
            url: {
              query: false,
            },
          },
        },
      });

      const context = createStepContext();
      await step.executionHandler(context);

      const stepConfig = buildStepTestConfigForStep(Steps.SYNCHRONIZE);
      const stepResult = await executeStepWithDependencies(stepConfig);

      const accountEntity = stepResult.collectedEntities.filter(
        (e) => e._type === Entities.ACCOUNT._type,
      );
      const computerEntities = stepResult.collectedEntities.filter(
        (e) => e._type === Entities.COMPUTER._type,
      );
      const accountComputerRelationships = stepResult.collectedRelationships.filter(
        (e) => e._type === Relationships.ACCOUNT_HAS_ENDPOINT._type,
      );

      const endpointProtectsDeviceMappedRelationships = stepResult.collectedRelationships.filter(
        (e) => e._type === MappedRelationships.ENDPOINT_PROTECTS_DEVICE._type,
      );

      // Assert that all collected objects have length >= 1
      expect(accountEntity.length).toBe(1);
      expect(computerEntities.length).toBeGreaterThanOrEqual(1);
      expect(accountComputerRelationships.length).toBeGreaterThanOrEqual(1);
      expect(
        endpointProtectsDeviceMappedRelationships.length,
      ).toBeGreaterThanOrEqual(1);

      // Asset they match schema
      expect(accountEntity).toMatchGraphObjectSchema(Entities.ACCOUNT);
      expect(computerEntities).toMatchGraphObjectSchema(Entities.COMPUTER);
      expect(accountComputerRelationships).toMatchDirectRelationshipSchema(
        Relationships.ACCOUNT_HAS_ENDPOINT,
      );

      // There isn't a matcher for mapped relationships in the sdk, so
      // for now this is a simple manual check
      endpointProtectsDeviceMappedRelationships.map((rel) => {
        expect(rel).toMatchObject({
          _type: MappedRelationships.ENDPOINT_PROTECTS_DEVICE._type,
          _class: MappedRelationships.ENDPOINT_PROTECTS_DEVICE._class,
          _mapping: {
            relationshipDirection:
              MappedRelationships.ENDPOINT_PROTECTS_DEVICE.direction,
            targetEntity: {
              _type: MappedRelationships.ENDPOINT_PROTECTS_DEVICE.targetType,
              _class: ['Device', 'Host'],
            },
          },
        });
      });
    });
  });
});
