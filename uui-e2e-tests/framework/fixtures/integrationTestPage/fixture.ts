import { IntegrationTestPage } from './IntegrationTestPage';
import { buildFixture } from '../shared/fixtureBuilder';

export const test = buildFixture({
    PageWrapperConstructor: IntegrationTestPage,
    initialUrl: '/',
});
