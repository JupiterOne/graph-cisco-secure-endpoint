import { retry } from '@lifeomic/attempt';
import nodeFetch, { Request } from 'node-fetch';
import base64 from 'base-64';

import { retryableRequestError, fatalRequestError } from './error';
import {
  CiscoAmpComputer,
  CiscoAmpApiResponse,
  CiscoAmpVulnerability,
} from './types';
import { URLSearchParams } from 'url';

export interface ServicesClientInput {
  apiEndpoint: string;
  apiClientId: string;
  apiKey: string;
}

export type ResourceIteratee<T> = (each: T) => Promise<void>;

/**
 * Services Api
 * https://api-docs.amp.cisco.com/api_resources?api_host=api.amp.cisco.com&api_version=v1
 */
export class ServicesClient {
  readonly host: string;
  readonly auth: string;

  constructor(config: ServicesClientInput) {
    this.host = config.apiEndpoint.toLowerCase().replace(/^https?:\/\//, '');
    this.auth = `Basic ${base64.encode(
      `${config.apiClientId}:${config.apiKey}`,
    )}`;
  }

  /**
   * Gets Cisco AMP Api version
   * @returns Promise<CiscoAmpApiResponse<Record<string, never>>>
   */
  getVersion(): Promise<CiscoAmpApiResponse<Record<string, never>>> {
    return this.fetch('/v1/version');
  }

  /**
   * iterateComputers iterates over all computers
   * and calls the provided `ResourceIteratee` for each Computer.
   *
   * @param fn ResourceIteratee that will be called for each Computer
   * @returns Promise<void>
   */
  async iterateComputers(
    fn: ResourceIteratee<CiscoAmpComputer>,
  ): Promise<void> {
    return await this.createResourceIterator('/v1/computers')(fn);
  }

  /**
   * iterateVulnerabilities iterates over all vulnerabilities
   * and calls the provided `ResourceIteratee` for each vulnerability.
   *
   * @param fn ResourceIteratee function tha will be called for each Vulnerability
   * @returns Promise<void>
   */
  async iterateVulnerabilities(
    fn: ResourceIteratee<CiscoAmpVulnerability>,
  ): Promise<void> {
    return await this.createResourceIterator('/v1/vulnerabilities')(fn);
  }

  /**
   * createResourceIterator creates a function that will paginate the resources
   * and call the provided `ResourceIteratee` for each resource.
   *
   * @param url the url whose resources will be iterated
   * @returns a function that will call ResourceIteratee for each resource
   */
  createResourceIterator(
    url: string,
  ): <T>(fn: ResourceIteratee<T>) => Promise<void> {
    const limit = 500;
    let offset = 0;
    let total = 0;

    return async <T>(fn: ResourceIteratee<T>): Promise<void> => {
      do {
        const response: CiscoAmpApiResponse<T> = await this.fetch(url, {
          offset: offset.toString(),
        });
        total = response.metadata.results.total;
        offset += limit;

        if (Array.isArray(response.data)) {
          for (const data of response.data) {
            await fn(data);
          }
        } else {
          await fn(response.data);
        }
      } while (offset < total);
    };
  }

  fetch<T = object>(
    url: string,
    queryParams: { [param: string]: string | string[] } = {},
    request?: Omit<Request, 'url'>,
  ): Promise<T> {
    return retry(
      async () => {
        const qs = new URLSearchParams(queryParams).toString();
        const response = await nodeFetch(
          `https://${this.host}${url}${qs ? '?' + qs : ''}`,
          {
            ...request,
            headers: {
              Authorization: this.auth,
              ...request?.headers,
            },
          },
        );

        /**
         * We are working with a json api, so just return the parsed data.
         */
        if (response.ok) {
          return response.json() as T;
        }

        if (isRetryableRequest(response)) {
          throw retryableRequestError(response);
        } else {
          throw fatalRequestError(response);
        }
      },
      {
        maxAttempts: 10,
        delay: 200,
        factor: 2,
        jitter: true,
        handleError: (err, context) => {
          if (!err.retryable) {
            // can't retry this? just abort
            context.abort();
          }
        },
      },
    );
  }
}

/**
 * Function for determining if a request is retryable
 * based on the returned status.
 */
function isRetryableRequest({ status }: Response): boolean {
  return (
    // 5xx error from provider (their fault, might be retryable)
    // 429 === too many requests, we got rate limited so safe to try again
    status >= 500 || status === 429
  );
}
