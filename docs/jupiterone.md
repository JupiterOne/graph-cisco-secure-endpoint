# JupiterOne Managed Integration for Cisco AMP

## Overview

JupiterOne provides a managed integration for Cisco AMP for Endpoints. The
integration connects directly to [Cisco AMP for Endpoints REST API][1] to obtain
endpoint protection and configuration information.

## Cisco AMP + JupiterOne Integration Benefits

- Visualize Cisco AMP endpoint agents and the devices they protect in the
  JupiterOne graph.
- Map Cisco AMP endpoint agents to devices and devices to the employee who is
  the owner.  
- Monitor changes to Cisco AMP endpoints using JupiterOne alerts.

## How it Works

- JupiterOne periodically fetches Cisco AMP endpoints and the devices they protect to update the graph.
- Write JupiterOne queries to review and monitor updates to the graph.
- Configure alerts to take action when the JupiterOne graph changes.

## Requirements

- JupiterOne requires the endpoint hostname of the Cisco AMP account. 
The API Client ID and Key are also required.
- You must have permission in JupiterOne to install new integrations.

## Integration Instance Configuration 

To generating Client ID and API Key:

- Log in to your **AMP for Endpoints Console**.
- Go to **Accounts** > **API Credentials**.
- Click **New API Credentials** to generate the Client ID and secure API Key.

Valid API Endpoints include:

- `api.amp.cisco.com`
- `api.apjc.amp.cisco.com`
- `api.eu.amp.cisco.com`

## Entities

The following entity resources are ingested when the integration runs.

| Cisco AMP Resources | \_type of the Entity | \_class of the Entity |
| ------------------- | -------------------- | --------------------- |
| Account             | `cisco_amp_account`  | `Account`             |
| Computer            | `cisco_amp_endpoint` | `HostAgent`           |

## Relationships

The following relationships are created:

| From                | Relationship | To                   |
| ------------------- | ------------ | -------------------- |
| `cisco_amp_account` | **HAS**      | `cisco_amp_endpoint` |

The following relationships are mapped:

| From                 | Relationship | To              |
| -------------------- | ------------ | --------------- |
| `cisco_amp_endpoint` | **Protects** | `user_endpoint` |

[1]: https://api-docs.amp.cisco.com/
