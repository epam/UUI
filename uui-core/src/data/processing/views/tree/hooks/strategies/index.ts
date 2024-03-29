import { useAsyncTree } from './asyncTree';
import { useLazyTree } from './lazyTree';
import { useSyncTree } from './syncTree';

export const strategies = {
    sync: useSyncTree,
    async: useAsyncTree,
    lazy: useLazyTree,
};

export type {
    UseTreeProps,
    LoadMissingRecords,
    GetItemStatus,
} from './types';
