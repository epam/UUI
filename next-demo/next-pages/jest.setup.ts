import '@testing-library/jest-dom';
import { setupJsDom } from '@epam/uui-test-utils';
import utils from 'node:util';

setupJsDom(global, {
    mockCommon3rdPartyDeps: true,
});

Object.assign(global, {
    TextDecoder: utils.TextDecoder,
    TextEncoder: utils.TextEncoder,
});

jest.mock('nanoid', () => {
    return {
        nanoid: ()=>{},
    };
});
