import { normalizeFilter } from "../helpers";

describe('normalizeFilter', () => {
    it('should normalize filter', () => {
        expect(normalizeFilter(undefined)).toBeUndefined();
        expect(normalizeFilter({})).toBeUndefined();
        expect(normalizeFilter({ test: undefined })).toBeUndefined();
        expect(normalizeFilter({ test1: undefined, test2: undefined, test3: undefined })).toBeUndefined();
        expect(normalizeFilter({ test: "test" })).toEqual({ test: "test" });
        expect(normalizeFilter({ test1: "test1", test2: undefined })).toEqual({ test1: "test1" });
        expect(normalizeFilter({ test1: [1, 2, 3], test2: undefined })).toEqual({ test1: [1, 2, 3] });
        expect(normalizeFilter({ test1: {}, test2: undefined })).toEqual({ test1: {} });
        expect(normalizeFilter({ test1: {}, test2: null })).toEqual({ test1: {}, test2: null });
        expect(normalizeFilter({ test1: { from: null, to: null }, test2: null }))
            .toEqual({ test1: { from: null, to: null }, test2: null });
    });
});