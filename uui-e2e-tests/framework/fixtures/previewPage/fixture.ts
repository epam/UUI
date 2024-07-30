import { PreviewPage } from './previewPage';
import { PREVIEW_URL } from '../../constants';
import { buildFixture } from '../shared/fixtureBuilder';

export const test = buildFixture(PREVIEW_URL, PreviewPage);
