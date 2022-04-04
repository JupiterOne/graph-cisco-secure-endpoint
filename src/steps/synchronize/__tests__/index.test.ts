import { createStepContext } from '../../../../test';
import { Recording } from '@jupiterone/integration-sdk-testing';

import step from '../index';
import { setupCiscoAmpRecording } from '../../../../test/recording';

describe('syncronizeStep', () => {
  let recording: Recording;
  afterEach(async () => {
    await recording.stop();
  });

  describe('#fetchComputers', () => {
    test('should process computer entities', async () => {
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

      expect(context.jobState.collectedEntities).toHaveLength(2);
      expect(context.jobState.collectedRelationships).toHaveLength(2);

      expect(context.jobState.collectedEntities).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            _type: 'cisco_amp_account',
            _class: ['Account'],
          }),
          expect.objectContaining({
            _type: 'cisco_amp_endpoint',
            _class: ['HostAgent'],
            hardwareId: '246f2e58-14c0-5684-ab92-6bcaf5d73838',
            platform: 'darwin',
            osName: 'macOS',
            osVersion: '10.15.3',
            hostname: 'erkangs-lifeomic-macbook-2',
            displayName: 'Erkang’s LifeOmic MacBook (2)',
          }),
        ]),
      );
    });
  });
});
