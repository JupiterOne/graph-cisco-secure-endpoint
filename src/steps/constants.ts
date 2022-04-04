import {
  RelationshipClass,
  RelationshipDirection,
  StepEntityMetadata,
  StepMappedRelationshipMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps = {
  SYNCHRONIZE: 'synchronize',
  VULNERABILITIES: 'fetch-vulnerabilities',
};

export const Entities: Record<
  'ACCOUNT' | 'COMPUTER' | 'VULNERABILITY',
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
  VULNERABILITY: {
    resourceName: 'Vulnerability',
    _type: 'cisco_amp_vulnerability',
    _class: ['Vulnerability'],
  },
};

export const Relationships: Record<
  'ACCOUNT_HAS_ENDPOINT',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_ENDPOINT: {
    _type: 'cisco_amp_account_has_endpoint',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.COMPUTER._type,
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
