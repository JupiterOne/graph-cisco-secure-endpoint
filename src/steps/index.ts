import { synchronizeSteps } from './synchronize';
import { fetchFindingsSteps } from './findings';

const integrationSteps = [...synchronizeSteps, ...fetchFindingsSteps];

export { integrationSteps };
