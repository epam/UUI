import { MODES } from './types';
import { useClientAsyncTree } from './useClientAsyncTree';
import { useServerAsyncTree } from './useServerAsyncTree';

export const modes = {
    [MODES.server]: useServerAsyncTree,
    [MODES.client]: useClientAsyncTree,
};
