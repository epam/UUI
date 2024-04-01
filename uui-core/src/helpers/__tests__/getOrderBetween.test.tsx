import { getOrderBetween, indexToOrder } from '../getOrderBetween';

describe('getOrderBetween', () => {
    it('computes order between existing', () => {
        const order = getOrderBetween('a', 'z');
        expect(order > 'a').toBe(true);
        expect(order < 'z').toBe(true);
    });

    it('computes order on top', () => {
        const order = getOrderBetween(null, 's');
        expect(order < 's').toBe(true);
    });

    it('computes order on bottom', () => {
        const order = getOrderBetween('s', null);
        expect(order > 's').toBe(true);
    });

    it('computes order between close orders', () => {
        const order = getOrderBetween('aa', 'ab');
        expect(order > 'aa').toBe(true);
        expect(order < 'ab').toBe(true);
    });

    // When adding an 'order' field to existing DB,
    // we suggest to just use analog of "1".padStart(5 /* or more to fit all numbers */, '0')
    // to not bother with UUI-like implementation in DB
    // This tests are to check that that's works

    it('can insert between 0001 and 0002', () => {
        const order = getOrderBetween('0001', '0002');
        expect(order > '0001').toBe(true);
        expect(order < '0002').toBe(true);
    });

    it('can insert before 0001', () => {
        const order = getOrderBetween(null, '0001');
        expect(order > '0').toBe(true);
        expect(order < '0001').toBe(true);
    });

    it('can insert after 9999', () => {
        const order = getOrderBetween('9999', null);
        expect(order > '9999').toBe(true);
        expect(order < 'z').toBe(true);
    });

    it('can insert before "a"', () => {
        const order = getOrderBetween(null, 'a');
        expect(order < 'a').toBe(true);
    });

    const hasDigits = (s: string) => !!s.match(/\d+/);

    it('does not generate digits if possible', () => {
        const order = getOrderBetween('bb', 'bbb');
        expect(hasDigits(order)).toBe(false);
        expect(order > 'bb').toBe(true);
        expect(order < 'bbb').toBe(true);
    });

    it('generates digits if needed', () => {
        const order = getOrderBetween('a11', 'a12');
        expect(hasDigits(order)).toBe(true);
        expect(order > 'a11').toBe(true);
        expect(order < 'a12').toBe(true);
    });

    it('can convert index to order', () => {
        const o1 = indexToOrder(1);
        const o2 = indexToOrder(2);
        expect(o1 < o2).toBe(true);
    });

    it('can find order between orders generated with indexToOrder', () => {
        const o1 = indexToOrder(0);
        const o2 = indexToOrder(1);
        const o3 = indexToOrder(51);
        const o4 = indexToOrder(100500);

        const o0 = getOrderBetween(null, o1);
        const o12 = getOrderBetween(o1, o2);
        const o23 = getOrderBetween(o2, o3);
        const o34 = getOrderBetween(o3, o4);
        const o40 = getOrderBetween(o4, null);

        expect(o0 < o1).toBe(true);
        expect(o1 < o12).toBe(true);
        expect(o12 < o2).toBe(true);
        expect(o2 < o23).toBe(true);
        expect(o23 < o3).toBe(true);
        expect(o3 < o34).toBe(true);
        expect(o34 < o4).toBe(true);
        expect(o4 < o40).toBe(true);
    });

    it('indexToOrder can handle huge numbers', () => {
        const o1 = indexToOrder(1000000000);
        const o2 = indexToOrder(10050010050);
        const o3 = indexToOrder(123456789123);
        const o4 = indexToOrder(9999999999999);
        expect(o1.length < 20).toBe(true);
        expect(o2.length < 20).toBe(true);
        expect(o3.length < 20).toBe(true);
        expect(o4.length < 20).toBe(true);
        expect(o1 < o2).toBe(true);
        expect(o2 < o3).toBe(true);
        expect(o3 < o4).toBe(true);
    });
});
