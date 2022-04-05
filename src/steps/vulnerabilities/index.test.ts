import {
  executeStepWithDependencies,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { setupCiscoAmpRecording } from '../../../test/recording';
import { Steps } from '../constants';

describe('fetchVulnerabilitiesSteps', () => {
  let recording: Recording;
  afterEach(async () => {
    await recording.stop();
  });
  describe('#fetchVulnerabilities', () => {
    test('should create vulnerability entities', async () => {
      recording = setupCiscoAmpRecording({
        directory: __dirname,
        name: 'fetchVulnerabilities',
      });
      const stepConfig = buildStepTestConfigForStep(Steps.VULNERABILITIES);
      const stepResult = await executeStepWithDependencies(stepConfig);
      expect(stepResult).toMatchStepMetadata(stepConfig);
    });
  });
});
