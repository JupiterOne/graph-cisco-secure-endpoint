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

      // When there are over 1000 computers, only the first 1000 will appear on
      // the vulnerability response. This case should be handled by
      // using IterateComputersWithVulnerability
      if (vuln.computers_total_count > 1000) {
        logger.warn(
          'More than 1000 computers have vulnerability. API Response only contains first 1000 computers with vulnerability.',
        );
      }

      for (const comp of vuln.computers) {
        const findingEntity = createFindingEntity(vuln, cve, comp);
        if (!jobState.hasKey(findingEntity._key)) {
          await jobState.addEntity(findingEntity);
        }

        const findingVulnRelationship = createDirectRelationship({
          _class: Relationships.FINDING_IS_VULNERABILITY._class,
          from: findingEntity,
          to: vulnEntity,
        });
        if (!jobState.hasKey(findingVulnRelationship._key)) {
          await jobState.addRelationship(findingVulnRelationship);
        }

        const compEntityKey = `cisco-amp-endpoint:${comp.connector_guid}`;
        if (!jobState.hasKey(compEntityKey)) {
          logger.error(
            `Computer Entity with key, cisco-amp-endpoint:${comp.connector_guid}, is missing from jobState.`,
          );
          continue;
        }

        const compFindingRelationship = createDirectRelationship({
          _class: Relationships.COMPUTER_IDENTIFIED_FINDING._class,
          fromKey: compEntityKey,
          fromType: Entities.COMPUTER._type,
          toKey: findingEntity._key,
          toType: Entities.FINDING._type,
        });
        if (!jobState.hasKey(compFindingRelationship._key)) {
          await jobState.addRelationship(compFindingRelationship);
        }
      }
    }
  });
}

export const fetchFindingsSteps = [
  {
    id: Steps.FINDINGS,
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
