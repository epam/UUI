import "@testing-library/jest-dom";
import { setupJsDom } from '@epam/uui-test-utils';
import utils from 'node:util';

// eslint-disable-next-line no-undef
setupJsDom(global, {
    mockCommon3rdPartyDeps: true,
});

// eslint-disable-next-line no-undef
Object.assign(global, {
    TextDecoder: utils.TextDecoder,
    TextEncoder: utils.TextEncoder,
})

jest.mock("nanoid", () => { return {
    nanoid : ()=>{}
} });

