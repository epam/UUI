import '@testing-library/jest-dom';
import { setupJsDom } from './../../test-utils/src/jsdom/setupJsDom';

window.__DEV__ = true;
window.__PACKAGE_VERSION__ = '';

setupJsDom(global, { mockCommon3rdPartyDeps: true });
