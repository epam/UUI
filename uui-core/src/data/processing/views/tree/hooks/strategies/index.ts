import { useLazyTreeStrategy } from './lazyTree';
import { usePlainTreeStrategy } from './plainTree';

export const strategies = {
    plain: usePlainTreeStrategy,
    lazy: useLazyTreeStrategy,
};
