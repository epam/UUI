import '@testing-library/jest-dom';
import { setupJsDom } from './../../test-utils/src/jsdom/setupJsDom.js';

window.__DEV__ = true;
window.__PACKAGE_VERSION__ = '';

setupJsDom(global);
