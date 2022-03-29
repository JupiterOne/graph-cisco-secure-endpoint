import { convertComputer, convertNetworkAddressesToArray } from './entities';

describe('entity converter tests', () => {
  describe('#convertComputer', () => {
    test('correctly converts input', () => {
      const input = {
        // data comes from example response:
        // https://api-docs.amp.cisco.com/api_actions/details?api_action=GET+%2Fv1%2Fcomputers&api_host=api.amp.cisco.com&api_resource=Computer&api_version=v1
        data: [
          {
            connector_guid: '6add26c9-4975-4780-a552-310e97a5311d',
            hostname: 'Demo_AMP',
            windows_processor_id: '3bd6928e4a5170f',
            active: true,
            links: {
              computer:
                'https://api.amp.cisco.com/v1/computers/6add26c9-4975-4780-a552-310e97a5311d',
              trajectory:
                'https://api.amp.cisco.com/v1/computers/6add26c9-4975-4780-a552-310e97a5311d/trajectory',
              group:
                'https://api.amp.cisco.com/v1/groups/6c3c2005-4c74-4ba7-8dbb-c4d5b6bafe03',
            },
            connector_version: '99.0.99.20946',
            operating_system: 'Windows 10',
            internal_ips: ['161.30.183.117'],
            external_ip: '84.108.84.14',
            group_guid: '6c3c2005-4c74-4ba7-8dbb-c4d5b6bafe03',
            install_date: '2022-02-09T16:44:08Z',
            is_compromised: false,
            demo: true,
            network_addresses: [
              {
                mac: 'b9:5c:78:9b:19:ff',
                ip: '161.30.183.117',
              },
            ],
            policy: {
              guid: '520c7c68-a637-43b1-b851-7830b0b336b6',
              name: 'Protect Policy',
            },
            groups: [
              {
                guid: '6c3c2005-4c74-4ba7-8dbb-c4d5b6bafe03',
                name: 'Protect',
              },
            ],
            last_seen: '2022-03-11T16:44:08Z',
            faults: [],
            isolation: {
              available: false,
              status: 'not_isolated',
            },
            orbital: {
              status: 'not_enabled',
            },
          },
          {
            connector_guid: '3aab41e5-c52f-487a-963c-17ab34177760',
            hostname: 'Demo_AMP_Exploit_Prevention',
            windows_processor_id: 'e4fd795382a6b10',
            active: true,
            links: {
              computer:
                'https://api.amp.cisco.com/v1/computers/3aab41e5-c52f-487a-963c-17ab34177760',
              trajectory:
                'https://api.amp.cisco.com/v1/computers/3aab41e5-c52f-487a-963c-17ab34177760/trajectory',
              group:
                'https://api.amp.cisco.com/v1/groups/6c3c2005-4c74-4ba7-8dbb-c4d5b6bafe03',
            },
            connector_version: '99.0.99.20946',
            operating_system: 'Windows 10',
            internal_ips: ['173.39.38.1'],
            external_ip: '192.30.201.253',
            group_guid: '6c3c2005-4c74-4ba7-8dbb-c4d5b6bafe03',
            install_date: '2022-02-09T16:44:08Z',
            is_compromised: false,
            demo: true,
            network_addresses: [
              {
                mac: '04:3f:62:17:4f:d3',
                ip: '173.39.38.1',
              },
            ],
            policy: {
              guid: '520c7c68-a637-43b1-b851-7830b0b336b6',
              name: 'Protect Policy',
            },
            groups: [
              {
                guid: '6c3c2005-4c74-4ba7-8dbb-c4d5b6bafe03',
                name: 'Protect',
              },
            ],
            last_seen: '2022-03-11T16:44:08Z',
            faults: [],
            isolation: {
              available: false,
              status: 'not_isolated',
            },
            orbital: {
              status: 'not_enabled',
            },
          },
        ],
      };

      const expected = [
        {
          _rawData: [
            {
              name: 'default',
              rawData: input.data[0],
            },
          ],
          _class: ['HostAgent'],
          _key: 'cisco-amp-endpoint:6add26c9-4975-4780-a552-310e97a5311d',
          _type: 'cisco_amp_endpoint',
          active: true,
          connectorGuid: '6add26c9-4975-4780-a552-310e97a5311d',
          connectorVersion: '99.0.99.20946',
          createdOn: undefined,
          demo: true,
          displayName: 'Demo_AMP',
          externalIp: '84.108.84.14',
          function: ['endpoint-protection', 'anti-malware'],
          groupGuid: '6c3c2005-4c74-4ba7-8dbb-c4d5b6bafe03',
          hardwareId: '3bd6928e4a5170f',
          hostname: 'demo_amp',
          id: '6add26c9-4975-4780-a552-310e97a5311d',
          installDate: undefined,
          installedOn: 1644425048000,
          internalIps: ['161.30.183.117'],
          ipAddress: ['161.30.183.117'],
          isCompromised: false,
          isolationStatus: 'not_isolated',
          lastSeen: undefined,
          lastSeenOn: 1647017048000,
          macAddress: ['b9:5c:78:9b:19:ff'],
          name: 'Demo_AMP',
          networkAddresses: undefined,
          operatingSystem: 'Windows 10',
          orbitalStatus: 'not_enabled',
          osName: 'Windows',
          osDetails: 'Windows 10',
          osVersion: '10',
          platform: 'windows',
          policyId: '520c7c68-a637-43b1-b851-7830b0b336b6',
          policyName: 'Protect Policy',
          privateIp: ['161.30.183.117'],
          privateIpAddress: ['161.30.183.117'],
          publicIp: '84.108.84.14',
          publicIpAddress: '84.108.84.14',
          version: '99.0.99.20946',
          windowsProcessorId: '3bd6928e4a5170f',
        },
        {
          _rawData: [
            {
              name: 'default',
              rawData: input.data[1],
            },
          ],
          _class: ['HostAgent'],
          _key: 'cisco-amp-endpoint:3aab41e5-c52f-487a-963c-17ab34177760',
          _type: 'cisco_amp_endpoint',
          active: true,
          connectorGuid: '3aab41e5-c52f-487a-963c-17ab34177760',
          connectorVersion: '99.0.99.20946',
          createdOn: undefined,
          demo: true,
          displayName: 'Demo_AMP_Exploit_Prevention',
          externalIp: '192.30.201.253',
          function: ['endpoint-protection', 'anti-malware'],
          groupGuid: '6c3c2005-4c74-4ba7-8dbb-c4d5b6bafe03',
          hardwareId: 'e4fd795382a6b10',
          hostname: 'demo_amp_exploit_prevention',
          id: '3aab41e5-c52f-487a-963c-17ab34177760',
          installDate: undefined,
          installedOn: 1644425048000,
          internalIps: ['173.39.38.1'],
          ipAddress: ['173.39.38.1'],
          isCompromised: false,
          isolationStatus: 'not_isolated',
          lastSeen: undefined,
          lastSeenOn: 1647017048000,
          macAddress: ['04:3f:62:17:4f:d3'],
          name: 'Demo_AMP_Exploit_Prevention',
          networkAddresses: undefined,
          operatingSystem: 'Windows 10',
          orbitalStatus: 'not_enabled',
          osDetails: 'Windows 10',
          osName: 'Windows',
          osVersion: '10',
          platform: 'windows',
          policyId: '520c7c68-a637-43b1-b851-7830b0b336b6',
          policyName: 'Protect Policy',
          privateIp: ['173.39.38.1'],
          privateIpAddress: ['173.39.38.1'],
          publicIp: '192.30.201.253',
          publicIpAddress: '192.30.201.253',
          version: '99.0.99.20946',
          windowsProcessorId: 'e4fd795382a6b10',
        },
      ];

      for (let i = 0; i < input.data.length; i++) {
        const convertedEntity = convertComputer(input.data[i]);
        expect(convertedEntity).toEqual(expected[i]);
      }
    });
  });

  describe('#convertNetworkAddressesToArray', () => {
    test('correctly converts null and undefined data', () => {
      expect(convertNetworkAddressesToArray(undefined, 'test-key')).toEqual([]);
      expect(convertNetworkAddressesToArray(null, 'test-key')).toEqual([]);
    });

    test('correctly converts array of good data', () => {
      const input = [
        {
          mac: 'example-mac-1',
          ip: '0.0.0.0',
        },
        {
          mac: 'example-mac-2',
          ip: '0.0.0.1',
        },
      ];

      expect(convertNetworkAddressesToArray(input, 'ip')).toEqual([
        '0.0.0.0',
        '0.0.0.1',
      ]);

      expect(convertNetworkAddressesToArray(input, 'mac')).toEqual([
        'example-mac-1',
        'example-mac-2',
      ]);
    });

    test('correctly filters bad data', () => {
      const input = [
        {
          mac: '          ',
          ip: '              ',
        },
      ];

      expect(convertNetworkAddressesToArray(input, 'ip')).toEqual([]);
      expect(convertNetworkAddressesToArray(input, 'mac')).toEqual([]);
    });

    test('missing data is ignored', () => {
      const input = [{}];
      expect(convertNetworkAddressesToArray(input, 'ip')).toEqual([]);
      expect(convertNetworkAddressesToArray(input, 'mac')).toEqual([]);
    });
  });
});
