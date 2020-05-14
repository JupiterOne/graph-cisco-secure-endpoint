import { IntegrationInstanceConfigFieldMap } from '@jupiterone/integration-sdk';

const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  apiEndpoint: {
    type: 'string',
    mask: false,
  },
  apiClientId: {
    type: 'string',
    mask: false,
  },
  apiKey: {
    type: 'string',
    mask: true,
  },
};

export default instanceConfigFields;
