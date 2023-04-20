const { Lens } = require('../index');
const { LensBuilder } = require('../LensBuilder');

describe('LensBuilder - lenses are cached', () => {
    it('prop lens is cached', () => {
        var lens = Lens.onEditable({});
        var l1 = lens.prop('name');
        var l2 = lens.prop('name');
        expect(l1).toBe(l2);
    });
    it('index lens is cached', () => {
        var lens = Lens.onEditable({});
        var l1 = lens.index(0);
        var l2 = lens.index(0);
        expect(l1).toBe(l2);
    });
    it('index lens is cached (scalar)', () => {
        var lens = Lens.onEditable({});
        var l1 = lens.default(0);
        var l2 = lens.default(0);
        expect(l1).toBe(l2);
    });
    it('default lens is cached', () => {
        var obj = { x: 1 };
        var lens = Lens.onEditable({});
        var l1 = lens.default(obj);
        var l2 = lens.default(obj);
        expect(l1).toBe(l2);
    });
    it('onChange lens is cached (object)', () => {
        var onChange = (o, n) => n;
        var lens = Lens.onEditable({});
        var l1 = lens.onChange(onChange);
        var l2 = lens.onChange(onChange);
        expect(l1).toBe(l2);
    });
    it('chained prop/index lens is cached', () => {
        var lens = Lens.onEditable({ value: { obj: { arr: [1] } } });
        var l1 = lens.prop('obj').default(0).prop('arr').index(0).prop('test');
        var l2 = lens.prop('obj').default(0).prop('arr').index(0).prop('test');
        expect(l1).toBe(l2);
    });
    it('clears cache if limit is hit', () => {
        var lens = Lens.onEditable({ value: ['test'] });
        const prevCacheSize = LensBuilder.MAX_CACHE_SIZE;
        LensBuilder.MAX_CACHE_SIZE = 2;
        var lensA = lens.prop('a');
        // 1 cache entry left
        var l1 = lens.prop('name');
        var l2 = lens.prop('name');
        expect(l1).toBe(l2);
        var lensB = lens.prop('b');
        var lensC = lens.prop('c');
        // now 'name' lens should be pushed out from cache
        var l3 = lens.prop('name');
        expect(l3).not.toBe(l1);

        LensBuilder.MAX_CACHE_SIZE = prevCacheSize;
    });
});
