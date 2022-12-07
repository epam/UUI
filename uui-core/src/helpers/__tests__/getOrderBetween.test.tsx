import { getOrderBetween } from "../getOrderBetween"

describe('getOrderBetween', () => {
    it('computes order between existing', () => {
        const order = getOrderBetween('a', 'z');
        expect(order > 'a').toBe(true);
        expect(order < 'z').toBe(true);
    })

    it('computes order on top', () => {
        const order = getOrderBetween(null, 's');
        expect(order < 's').toBe(true);
    })

    it('computes order on bottom', () => {
        const order = getOrderBetween('s', null);
        expect(order > 's').toBe(true);
    })

    it('computes order between close orders', () => {
        const order = getOrderBetween('aa', 'ab');
        expect(order > 'aa').toBe(true);
        expect(order < 'ab').toBe(true);
    })
})
