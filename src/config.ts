import {
  IntegrationInstanceConfig,
  IntegrationInstanceConfigFieldMap,
} from '@jupiterone/integration-sdk-core';

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  apiEndpoint: {
    type: 'string',
  },
  apiClientId: {
    type: 'string',
  },
  apiKey: {
    type: 'string',
    mask: true,
  },
};

export interface IntegrationConfig extends IntegrationInstanceConfig {
  apiEndpoint: string;
  apiClientId: string;
  apiKey: string;
}
