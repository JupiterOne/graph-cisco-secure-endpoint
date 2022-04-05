import { synchronizeSteps } from './synchronize';
import { fetchVulnerabilitiesSteps } from './vulnerabilities';

const integrationSteps = [...synchronizeSteps, ...fetchVulnerabilitiesSteps];

export { integrationSteps };
