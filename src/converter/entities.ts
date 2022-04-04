import { CiscoAmpComputer } from '../collector';
import {
  createIntegrationEntity,
  getTime,
  convertProperties,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { Entities } from '../steps/constants';

export const convertComputer = (
  data: CiscoAmpComputer,
): ReturnType<typeof createIntegrationEntity> => {
  const publicIp = data.external_ip;
  const privateIp = data.internal_ips;
  const osDetails = data.operating_system;
  const osRegex = /(windows|macos|os ?x|linux|red ?hat|cent ?os|ios|android)/i;
  const osMatch = osDetails?.match(osRegex);
  let platform;
  let osName;
  let osVersion;

  if (osMatch) {
    platform = osMatch[1]
      .toLowerCase()
      .replace(/macos|os ?x/i, 'darwin')
      .replace(/red ?hat|cent ?os/i, 'linux');
    osName = osMatch[1].replace(/macos|os ?x/i, 'macOS');
    osVersion = osDetails.replace(osRegex, '').trim().split(',')[0];
  }

  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        ...convertProperties(data),
        _key: `cisco-amp-endpoint:${data.connector_guid}`,
        _type: Entities.COMPUTER._type,
        _class: Entities.COMPUTER._class,
        id: data.connector_guid,
        name: data.hostname,
        displayName: data.hostname,
        hostname: normalizeHostname(data.hostname),
        function: ['endpoint-protection', 'anti-malware'],
        hardwareId: data.mac_hardware_id || data.windows_processor_id,
        installedOn: getTime(data.install_date),
        lastSeenOn: getTime(data.last_seen),
        installDate: undefined,
        lastSeen: undefined,
        policyId: data.policy?.guid,
        policyName: data.policy?.name,
        version: data.connector_version,
        isolationStatus: data.isolation?.status,
        orbitalStatus: data.orbital?.status,
        networkAddresses: undefined,
        macAddress: convertNetworkAddressesToArray(
          data.network_addresses,
          'mac',
        ),
        ipAddress: convertNetworkAddressesToArray(data.network_addresses, 'ip'),
        publicIp,
        publicIpAddress: publicIp,
        privateIp,
        privateIpAddress: privateIp,
        osDetails,
        osName,
        osVersion,
        platform,
      },
    },
  });
};

/**
 *
 * @param id: the instance.id
 * @param name: the instance.name
 * @param description: the instance.description
 * @returns Entity
 */
export function createAccountEntity({
  id,
  name,
  description,
}: {
  id: string;
  name: string;
  description: string | undefined;
}): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {},
      assign: {
        _key: `cisco-amp-account:${id}`,
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
        name: name,
        displayName: name,
        description: description,
      },
    },
  });
}

interface NetworkAddress {
  mac?: string;
  ip?: string;
}

export function convertNetworkAddressesToArray(
  networkAddressData: NetworkAddress[] | undefined | null,
  key: string,
): string[] {
  if (Array.isArray(networkAddressData)) {
    return networkAddressData
      .map((elem) => elem[key])
      .filter((elem) => typeof elem === 'string' && elem.trim().length > 0);
  }

  // undefined or null data is returned as empty array
  return [];
}

function normalizeHostname(hostname: string): string {
  return hostname
    .replace(/[!#$%^&*(),?’'":{}|<>]/g, '')
    .replace(/\s/g, '-')
    .toLowerCase();
}
