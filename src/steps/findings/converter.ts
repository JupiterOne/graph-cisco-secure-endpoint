import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import {
  CiscoAmpComputerWithVulnerability,
  CiscoAmpVulnerability,
  CVE,
} from '../../collector';
import { Entities } from '../constants';

export enum FindingSeverityPriority {
  Informational = 'Informational',
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical',
  Unknown = 'Unknown',
}

export function getSeverity(numericSeverity: number): FindingSeverityPriority {
  if (numericSeverity === 0) {
    return FindingSeverityPriority.Informational;
  } else if (numericSeverity < 4) {
    return FindingSeverityPriority.Low;
  } else if (numericSeverity < 7) {
    return FindingSeverityPriority.Medium;
  } else if (numericSeverity < 10) {
    return FindingSeverityPriority.High;
  } else if (numericSeverity === 10) {
    return FindingSeverityPriority.Critical;
  } else {
    return FindingSeverityPriority.Unknown;
  }
}

export function createVulnerabilityEntity(cve: CVE): Entity {
  return createIntegrationEntity({
    entityData: {
      source: cve,
      assign: {
        _key: cve.id.toLowerCase(),
        _class: Entities.VULNERABILITY._class,
        _type: Entities.VULNERABILITY._type,
        name: cve.id,
        displayName: cve.id,
        cvssScore: cve.cvss,
        webLink: cve.link,
        references: [cve.link],
        category: 'application',
        // data-model props
        severity: getSeverity(cve.cvss),
        open: true,
        public: true,
        production: null,
        blocking: null,
      },
    },
  });
}

export function createFindingEntity(
  vuln: CiscoAmpVulnerability,
  cve: CVE,
  computer: CiscoAmpComputerWithVulnerability,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {},
      assign: {
        //_key: `cisco_amp_finding:${vuln.file.identity.sha256}:${cve.id}`,
        _key: `cisco_amp_finding:${computer.connector_guid}:${vuln.file.identity.sha256}:${cve.id}`,
        _type: Entities.FINDING._type,
        _class: Entities.FINDING._class,
        name: cve.id,
        displayName: cve.id,
        // data-model properties
        category: 'application',
        severity: getSeverity(cve.cvss),
        numericSeverity: cve.cvss,
        webLink: cve.link,
        public: true,
        open: true,
        // cisco specific properties
        application: vuln.application,
        applicationVersion: vuln.version,
        filename: vuln.file.filename,
        fileSha256: vuln.file.identity.sha256,
        // these are specific to the vulnerability not the computer?
        lastSeenOn: parseTimePropertyValue(vuln.latest_timestamp, 'ms'),
      },
    },
  });
}
