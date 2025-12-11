import { PreviewPage } from './previewPage';
import { PREVIEW_URL } from '../../constants';
import { buildFixture } from '../shared/fixtureBuilder';
import path from 'node:path';

export const test = buildFixture({
    PageWrapperConstructor: PreviewPage,
    initialUrl: PREVIEW_URL,
    extraStyles: path.join(__dirname, 'screenshot.css'),
});
