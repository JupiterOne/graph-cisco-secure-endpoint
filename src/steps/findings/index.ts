import {
  createDirectRelationship,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { CiscoAmpVulnerability, createServicesClient } from '../../collector';
import { IntegrationConfig } from '../../config';
import { Entities, Relationships, Steps } from '../constants';
import { createFindingEntity, createVulnerabilityEntity } from './converter';

export async function fetchVulnerabilities({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = createServicesClient(instance);

  await client.iterateVulnerabilities(async (vuln: CiscoAmpVulnerability) => {
    for (const cve of vuln.cves) {
      // skip entity creation if we have encountered the cve before
      let vulnEntity = await jobState.findEntity(cve.id.toLowerCase());
      if (!vulnEntity) {
        vulnEntity = await jobState.addEntity(createVulnerabilityEntity(cve));
      }

      // This case should be handled in the future with IterateComputersWithVulnerability
      if (vuln.computers_total_count > 1000) {
        logger.warn(
          'More than 1000 computers have vulnerability. API Response only contains first 1000 computers with vulnerability.',
        );
      }

      for (const comp of vuln.computers) {
        const findingEntity = await jobState.addEntity(
          createFindingEntity(vuln, cve, comp),
        );
        await jobState.addRelationship(
          createDirectRelationship({
            from: findingEntity,
            to: vulnEntity,
            _class: Relationships.FINDING_IS_VULNERABILITY._class,
          }),
        );

        const compEntity = await jobState.findEntity(
          `cisco-amp-endpoint:${comp.connector_guid}`,
        );
        if (compEntity) {
          await jobState.addRelationship(
            createDirectRelationship({
              from: compEntity,
              to: findingEntity,
              _class: Relationships.COMPUTER_IDENTIFIED_FINDING._class,
            }),
          );
        } else {
          logger.error(
            `Computer Entity with key, cisco-amp-endpoint:${comp.connector_guid}, is missing from jobState.`,
          );
        }
      }
    }
  });
}

export const fetchFindingsSteps = [
  {
    id: 'fetch-findings',
    name: 'Fetch Cisco AMP findings',
    entities: [Entities.FINDING, Entities.VULNERABILITY],
    relationships: [
      Relationships.COMPUTER_IDENTIFIED_FINDING,
      Relationships.FINDING_IS_VULNERABILITY,
    ],
    dependsOn: [Steps.SYNCHRONIZE],
    executionHandler: fetchVulnerabilities,
  },
];
