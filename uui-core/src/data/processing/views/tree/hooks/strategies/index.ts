import { useAsyncTreeStrategy } from './asyncTree/useAsyncTreeStrategy';
import { useLazyTreeStrategy } from './lazyTree';
import { usePlainTreeStrategy } from './plainTree';

export const strategies = {
    plain: usePlainTreeStrategy,
    async: useAsyncTreeStrategy,
    lazy: useLazyTreeStrategy,
};
