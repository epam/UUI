import '@testing-library/jest-dom';
import { setupJsDom } from './../../test-utils/src/jsdom/setupJsDom.js';

window.__DEV__ = true;

setupJsDom(global);
