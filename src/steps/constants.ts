import {
  RelationshipClass,
  RelationshipDirection,
  StepEntityMetadata,
  StepMappedRelationshipMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps = {
  SYNCHRONIZE: 'synchronize',
  FINDINGS: 'fetch-findings',
};

export const Entities: Record<
  'ACCOUNT' | 'COMPUTER' | 'FINDING' | 'VULNERABILITY',
  StepEntityMetadata
> = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'cisco_amp_account',
    _class: ['Account'],
    schema: {
      additionalProperties: true,
      properties: {
        _type: { const: 'cisco_amp_account' },
        _key: { type: 'string' },
        name: { type: 'string' },
        displayName: { type: 'string' },
      },
    },
  },
  COMPUTER: {
    resourceName: 'Computer',
    _type: 'cisco_amp_endpoint',
    _class: ['HostAgent'],
    schema: {
      additionalProperties: true,
      properties: {
        _type: { const: 'cisco_amp_endpoint' },
        _key: { type: 'string' },
        name: { type: 'string' },
        displayName: { type: 'string' },
        createdOn: { type: 'number' },
        createdBy: { type: 'string' },
        updatedOn: { type: 'number' },
        updatedBy: { type: 'string' },
        installedOn: { type: 'number' },
        lastSeenOn: { type: 'number' },
        version: { type: 'string' },
        publicIp: { type: 'string' },
        privateIpAddresses: { type: 'array' },
      },
    },
  },
  FINDING: {
    resourceName: 'Finding',
    _type: 'cisco_amp_finding',
    _class: ['Finding'],
    schema: {
      additionalProperties: true,
      properties: {
        _type: { const: 'cisco_amp_finding' },
        _key: { type: 'string' },
        name: { type: 'string' }, // cve.id
        displayName: { type: 'string' }, // cve.id
        application: { type: 'string' },
        filename: { type: 'string' },
        fileSha256: { type: 'string' },
        webLink: { type: 'string' },
        severity: { type: 'string' },
        numericSeverity: { type: 'number' },
      },
    },
  },
  VULNERABILITY: {
    resourceName: 'Vulnerability',
    _type: 'cve',
    _class: ['Vulnerability'],
    schema: {
      properties: {
        additionalProperties: {
          _type: { const: 'cve' },
          _key: { type: 'string' },
          name: { type: 'string' },
          displayName: { type: 'string' },
          severity: { type: 'string' },
          category: { type: 'string', const: 'application' },
          webLink: { type: 'string' },
        },
      },
      required: ['severity', 'webLink'],
    },
  },
};

export const Relationships: Record<
  | 'ACCOUNT_HAS_ENDPOINT'
  | 'COMPUTER_IDENTIFIED_FINDING'
  | 'FINDING_IS_VULNERABILITY',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_ENDPOINT: {
    _type: 'cisco_amp_account_has_endpoint',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.COMPUTER._type,
  },
  COMPUTER_IDENTIFIED_FINDING: {
    _type: 'cisco_amp_endpoint_identified_finding',
    sourceType: Entities.COMPUTER._type,
    _class: RelationshipClass.IDENTIFIED,
    targetType: Entities.FINDING._type,
  },
  FINDING_IS_VULNERABILITY: {
    _type: 'cisco_amp_finding_is_cve',
    sourceType: Entities.FINDING._type,
    _class: RelationshipClass.IS,
    targetType: Entities.VULNERABILITY._type,
  },
};

export const MappedRelationships: Record<
  'ENDPOINT_PROTECTS_DEVICE',
  StepMappedRelationshipMetadata
> = {
  ENDPOINT_PROTECTS_DEVICE: {
    _type: 'cisco_amp_endpoint_protects_device',
    _class: RelationshipClass.PROTECTS,
    sourceType: Entities.COMPUTER._type,
    targetType: 'user_endpoint',
    direction: RelationshipDirection.FORWARD,
  },
};
