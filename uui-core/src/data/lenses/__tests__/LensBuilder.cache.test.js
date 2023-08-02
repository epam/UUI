const { Lens } = require('../index');
const { LensBuilder } = require('../LensBuilder');

describe('LensBuilder - lenses are cached', () => {
    it('prop lens is cached', () => {
        const lens = Lens.onEditable({});
        const l1 = lens.prop('name');
        const l2 = lens.prop('name');
        expect(l1).toBe(l2);
    });
    it('index lens is cached', () => {
        const lens = Lens.onEditable({});
        const l1 = lens.index(0);
        const l2 = lens.index(0);
        expect(l1).toBe(l2);
    });
    it('index lens is cached (scalar)', () => {
        const lens = Lens.onEditable({});
        const l1 = lens.default(0);
        const l2 = lens.default(0);
        expect(l1).toBe(l2);
    });
    it('default lens is cached', () => {
        const obj = { x: 1 };
        const lens = Lens.onEditable({});
        const l1 = lens.default(obj);
        const l2 = lens.default(obj);
        expect(l1).toBe(l2);
    });
    it('onChange lens is cached (object)', () => {
        const onChange = (o, n) => n;
        const lens = Lens.onEditable({});
        const l1 = lens.onChange(onChange);
        const l2 = lens.onChange(onChange);
        expect(l1).toBe(l2);
    });
    it('chained prop/index lens is cached', () => {
        const lens = Lens.onEditable({ value: { obj: { arr: [1] } } });
        const l1 = lens.prop('obj').default(0).prop('arr').index(0)
            .prop('test');
        const l2 = lens.prop('obj').default(0).prop('arr').index(0)
            .prop('test');
        expect(l1).toBe(l2);
    });
    it('clears cache if limit is hit', () => {
        const lens = Lens.onEditable({ value: ['test'] });
        const prevCacheSize = LensBuilder.MAX_CACHE_SIZE;
        LensBuilder.MAX_CACHE_SIZE = 2;
        const lensA = lens.prop('a');
        expect(lensA).toBeTruthy();
        // 1 cache entry left
        const l1 = lens.prop('name');
        const l2 = lens.prop('name');
        expect(l1).toBe(l2);
        const lensB = lens.prop('b');
        expect(lensB).toBeTruthy();
        const lensC = lens.prop('c');
        expect(lensC).toBeTruthy();
        // now 'name' lens should be pushed out from cache
        const l3 = lens.prop('name');
        expect(l3).not.toBe(l1);

        LensBuilder.MAX_CACHE_SIZE = prevCacheSize;
    });
});
