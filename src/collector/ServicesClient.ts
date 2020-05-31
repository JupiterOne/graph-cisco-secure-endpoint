import { retry } from '@lifeomic/attempt';
import nodeFetch, { Request } from 'node-fetch';
import base64 from 'base-64';

import { retryableRequestError, fatalRequestError } from './error';
import {
  ListComputersResponse,
  CiscoAmpComputer,
  CiscoAmpApiResponse,
} from './types';
import { URLSearchParams } from 'url';

export interface ServicesClientInput {
  apiEndpoint: string;
  apiClientId: string;
  apiKey: string;
}

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

  getVersion(): Promise<CiscoAmpApiResponse> {
    return this.fetch('/v1/version');
  }

  iterateComputers(): Promise<CiscoAmpComputer[]> {
    return this.iterateAll('/v1/computers');
  }

  async iterateAll(url: string): Promise<CiscoAmpComputer[]> {
    const data = [];
    const limit = 500;
    let offset = 0;
    let total = 0;
    do {
      const response: ListComputersResponse = await this.fetch(url, {
        offset: offset.toString(),
      });
      total = response.metadata.results.total;
      offset += limit;
      data.push(...response.data);
    } while (offset < total);
    return data;
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
