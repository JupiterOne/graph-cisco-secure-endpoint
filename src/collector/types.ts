/* eslint-disable @typescript-eslint/no-explicit-any */

import { Opaque } from 'type-fest';

export interface PaginationInput {
  limit: string;
  offset: string;
}

export interface PaginatedResponse {
  index: number;
  items_per_page: number;
  current_item_count: number;
  total: number;
}

export interface CiscoAmpApiResponse {
  version: string;
  metadata: {
    links: {
      self: string;
    };
    results: PaginatedResponse;
  };
}

export interface ListComputersResponse extends CiscoAmpApiResponse {
  data: CiscoAmpComputer[];
}

export type CiscoAmpComputer = Opaque<any, 'CiscoAmpComputer'>;
