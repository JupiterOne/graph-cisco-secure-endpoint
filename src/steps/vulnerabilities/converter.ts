import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { CiscoAmpVulnerability } from '../../collector';
import { Entities } from '../constants';

export function createVulnerabilityEntity(vuln: CiscoAmpVulnerability): Entity {
  return createIntegrationEntity({
    entityData: {
      source: vuln,
      assign: {
        _key: `cisco_amp_vulnerability:${vuln.file.identity.sha256}`,
        _class: Entities.VULNERABILITY._class,
        _type: Entities.VULNERABILITY._type,
        name: vuln.application,
        displayName: vuln.application,
        sha256: vuln.file.identity.sha256,
        category: 'application',
        severity: null,
        blocking: null,
        open: null,
        production: null,
        public: null,
      },
    },
  });
}
