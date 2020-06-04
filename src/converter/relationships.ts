import {
  createIntegrationRelationship,
  Entity,
  Relationship,
  RelationshipDirection,
} from '@jupiterone/integration-sdk-core';

export const DEVICE_ENTITY_TYPE = 'user_endpoint';
export const DEVICE_ENTITY_CLASS = ['Device', 'Host'];
export const ENDPOINT_PROTECTION_RELATIONSHIP =
  'cisco_amp_endpoint_protects_device';

export const mapEndpointProtectionRelationship = (
  agent: Entity,
): Relationship =>
  createIntegrationRelationship({
    _key: `${agent._key}|protects|device:${agent.hardwareId}`,
    _type: ENDPOINT_PROTECTION_RELATIONSHIP,
    _class: 'PROTECTS',
    _mapping: {
      relationshipDirection: RelationshipDirection.FORWARD,
      sourceEntityKey: agent._key,
      targetFilterKeys: [['_type', 'macAddress']],
      targetEntity: {
        _type: DEVICE_ENTITY_TYPE,
        _class: DEVICE_ENTITY_CLASS,
        name: agent.name,
        displayName: agent.displayName,
        hostname: agent.hostname,
        macAddress: agent.macAddress,
        osName: agent.osName,
        osDetails: agent.osDetails,
        osVersion: agent.osVersion,
        platform: agent.platform,
        publicIp: agent.publicIp,
        publicIpAddress: agent.publicIpAddress,
        privateIp: agent.privateIp,
        privateIpAddress: agent.privateIpAddress,
        active: agent.active,
        lastSeenOn: agent.lastSeenOn,
      },
    },
  });
