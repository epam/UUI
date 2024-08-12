import { DocExamplePage } from './docExamplePage';
import { DOC_EXAMPLE_URL } from '../../constants';
import { buildFixture } from '../shared/fixtureBuilder';

export const test = buildFixture({
    PageWrapperConstructor: DocExamplePage,
    initialUrl: DOC_EXAMPLE_URL,
});
