import { CiscoAmpComputer } from '../collector';
import {
  createIntegrationEntity,
  getTime,
  convertProperties,
} from '@jupiterone/integration-sdk';

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
        _type: 'cisco_amp_endpoint',
        _class: ['HostAgent'],
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
        macAddress: data.network_addresses
          ?.map((a) => a.mac)
          .filter((a) => a.trim().length > 0),
        ipAddress: data.network_addresses
          ?.map((a) => a.ip)
          .filter((a) => a.trim().length > 0),
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

function normalizeHostname(hostname: string): string {
  return hostname
    .replace(/[!#$%^&*(),?’'":{}|<>]/g, '')
    .replace(/\s/g, '-')
    .toLowerCase();
}
