import memoize from 'lodash.memoize';

export const parseIconViewbox = memoize((viewbox: string) => {
    const nums = viewbox.split(' ').map(n => parseInt(n, 10));
    return { w: nums[2], h: nums[3]};
});