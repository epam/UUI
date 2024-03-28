import { useAsyncTree } from './asyncTree';
import { useLazyTree } from './lazyTree';
import { usePlainTree } from './plainTree';

export const strategies = {
    plain: usePlainTree,
    async: useAsyncTree,
    lazy: useLazyTree,
};

export type {
    UseTreeProps,
    LoadMissingRecords,
    GetItemStatus,
} from './types';
