import { IntegrationInstance } from '@jupiterone/integration-sdk';
import { ServicesClient } from './ServicesClient';

export * from './types';

/**
 * Creates a ServicesClient from an integration instance using it's
 * api key.
 */
export function createServicesClient(
  instance: IntegrationInstance,
): ServicesClient {
  const { apiEndpoint, apiClientId, apiKey } = instance.config;

  if (!apiEndpoint || !apiClientId || !apiKey) {
    throw new Error(
      'One of the required configuration items { "apiEndpoint", "apiClientId", "apiKey" } is missing on the integration instance config',
    );
  }

  return new ServicesClient({ apiEndpoint, apiClientId, apiKey });
}
