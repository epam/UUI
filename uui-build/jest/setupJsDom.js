import '@testing-library/jest-dom';
import utils from 'node:util';
import { setupJsDom } from './../../test-utils/src/jsdom/setupJsDom';

window.__DEV__ = true;
window.__PACKAGE_VERSION__ = '';

setupJsDom(global, { mockCommon3rdPartyDeps: true });

jest.mock('nanoid', () => {
    return {
        nanoid: ()=>{},
    };
});

Object.assign(global, {
    TextDecoder: utils.TextDecoder,
    TextEncoder: utils.TextEncoder,
});
