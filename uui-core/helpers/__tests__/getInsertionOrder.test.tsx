import { getInsertionOrder } from "../getInsertionOrder"
import { maxOrderStr, minOrderStr } from "../getOrderBetween";

describe('getInsertionOrder', () => {
    const list = ['a', 'c', 'b'];

    it('can insert on top', () => {
        const order = getInsertionOrder(list, 'before');
        expect(order < 'a').toBe(true);
    })

    it('can insert to bottom', () => {
        const order = getInsertionOrder(list, 'after');
        expect(order > 'c').toBe(true);
    })

    it('can insert before existing', () => {
        const order = getInsertionOrder(list, 'before', 'c');
        expect(order > 'b').toBe(true);
        expect(order < 'c').toBe(true);
    })

    it('can insert after existing', () => {
        const order = getInsertionOrder(list, 'after', 'a');
        expect(order > 'a').toBe(true);
        expect(order < 'b').toBe(true);
    })

    it('can insert before existing (top of the list)', () => {
        const order = getInsertionOrder(list, 'before', 'a');
        expect(order < 'a').toBe(true);
    })

    it('can insert after existing (bottom of the list)', () => {
        const order = getInsertionOrder(list, 'after', 'c');
        expect(order > 'c').toBe(true);
    })

    it('can insert on top (empty list)', () => {
        const order = getInsertionOrder([], 'before');
        expect(order > minOrderStr).toBe(true);
        expect(order < maxOrderStr).toBe(true);
    })

    it('can insert to bottom (empty list)', () => {
        const order = getInsertionOrder(list, 'after');
        expect(order > minOrderStr).toBe(true);
        expect(order < maxOrderStr).toBe(true);
    })

    it('can insert before existing (empty list)', () => {
        const order = getInsertionOrder(list, 'before', 'c');
        expect(order < 'c').toBe(true);
        expect(order > minOrderStr).toBe(true);
        expect(order < maxOrderStr).toBe(true);
    })

    it('can insert after existing (empty list)', () => {
        const order = getInsertionOrder(list, 'after', 'a');
        expect(order > 'a').toBe(true);
        expect(order > minOrderStr).toBe(true);
        expect(order < maxOrderStr).toBe(true);
    })
})
