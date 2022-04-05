import { IntegrationStepExecutionContext } from '@jupiterone/integration-sdk-core';
import { CiscoAmpVulnerability, createServicesClient } from '../../collector';
import { IntegrationConfig } from '../../config';
import { Entities } from '../constants';
import { createVulnerabilityEntity } from './converter';

export async function fetchVulnerabilities({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = createServicesClient(instance);

  await client.iterateVulnerabilities(async (vuln: CiscoAmpVulnerability) => {
    await jobState.addEntity(createVulnerabilityEntity(vuln));
  });
}

export const fetchVulnerabilitiesSteps = [
  {
    id: 'fetch-vulnerabilities',
    name: 'Fetch Cisco AMP vulnerabilities',
    entities: [Entities.VULNERABILITY],
    relationships: [],
    executionHandler: fetchVulnerabilities,
  },
];
