import { PreviewPage } from './previewPage';
import { PREVIEW_URL } from '../../constants';
import { buildFixture } from '../shared/fixtureBuilder';

export const test = buildFixture({
    PageWrapperConstructor: PreviewPage,
    initialUrl: PREVIEW_URL,
    extraStyles: 'framework/fixtures/previewPage/screenshot.css',
});
