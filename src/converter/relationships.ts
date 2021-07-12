import {
  createMappedRelationship,
  Entity,
  Relationship,
  RelationshipClass,
  RelationshipDirection,
} from '@jupiterone/integration-sdk-core';

export const DEVICE_ENTITY_TYPE = 'user_endpoint';
export const DEVICE_ENTITY_CLASS = ['Device', 'Host'];
export const ENDPOINT_PROTECTION_RELATIONSHIP =
  'cisco_amp_endpoint_protects_device';

export const mapEndpointProtectionRelationship = (
  agent: Entity,
): Relationship =>
  createMappedRelationship({
    _key: `${agent._key}|protects|device:${agent.hardwareId}`,
    _type: ENDPOINT_PROTECTION_RELATIONSHIP,
    _class: RelationshipClass.PROTECTS,
    _mapping: {
      relationshipDirection: RelationshipDirection.FORWARD,
      sourceEntityKey: agent._key,
      targetFilterKeys: [['_type', 'macAddress']],
      targetEntity: {
        _type: DEVICE_ENTITY_TYPE,
        _class: DEVICE_ENTITY_CLASS,
        name: agent.name as string,
        displayName: agent.displayName,
        hostname: agent.hostname as string,
        macAddress: agent.macAddress as string,
        osName: agent.osName as string,
        osDetails: agent.osDetails as string,
        osVersion: agent.osVersion as string,
        platform: agent.platform as string,
        publicIp: agent.publicIp as string,
        publicIpAddress: agent.publicIpAddress as string,
        privateIp: agent.privateIp as string,
        privateIpAddress: agent.privateIpAddress as string,
        active: agent.active as string,
        lastSeenOn: agent.lastSeenOn as string,
      },
    },
  });
