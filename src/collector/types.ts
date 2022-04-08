/* eslint-disable @typescript-eslint/no-explicit-any */

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

/**
 * CiscoAmpApiResponse structure
 */
export interface CiscoAmpApiResponse<T> {
  version: string;
  metadata: {
    links: {
      self: string;
    };
    results: PaginatedResponse;
  };
  data: T[] | T;
}

/**
 * CiscoAmpComputer resource  structure
 */
export interface CiscoAmpComputer {
  connector_guid: string;
  hostname: string;
  windows_processor_id: string;
  active: boolean;
  links: {
    computer: string;
    trajectory: string;
    group: string;
  };
  connector_version: string;
  operating_system: string;
  internal_ips: string[];
  external_ip: string;
  group_guid: string;
  install_date: string;
  is_compromised: boolean;
  demo: boolean;
  network_addresses: { mac: string; ip: string }[];
  policy: {
    guid: string;
    name: string;
  };
  groups: { guid: string; name: string }[];
  last_seen: string;
  faults: any[];
  isolation: {
    available: boolean;
    status: string;
  };
  orbital: {
    status: string;
  };
}

// A condensed Computer resource received from the
// /vulnerabilities/:sha265:/computers endpoint
export interface CiscoAmpComputerWithVulnerability {
  connector_guid: string;
  hostname: string;
  windows_processor_id: string;
  active: boolean;
  links: {
    computer: string;
    trajectory: string;
    group: string;
  };
}

export interface CVE {
  id: string;
  link: string;
  cvss: number;
}

export interface CiscoAmpVulnerability {
  application: string;
  version: string;
  file: {
    filename: string;
    identity: {
      sha256: string;
    };
  };
  cves: CVE[];
  latest_timestamp: number;
  latest_date: string;
  groups: {
    name: string;
    description: string;
    guid: string;
  }[];
  computers_total_count: number;
  computers: {
    connector_guid: string;
    hostname: string;
    windows_processor_id: string;
    active: boolean;
    links: {
      computer: string;
      trajectory: string;
      group: string;
    };
  }[];
}
