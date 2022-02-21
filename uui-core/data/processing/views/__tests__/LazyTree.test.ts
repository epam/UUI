import { DataSourceState, LazyDataSourceApi } from "../../types";
import { runDataQuery } from '../../../querying/runDataQuery';
import { DataQueryFilter } from '../../../..';
import { LazyTree, LazyTreeParams, loadLazyTree } from '../LazyTree';

interface TestItem {
    id: number;
    parentId?: number;
    childrenCount?: number;
}

const testData: TestItem[] = [
    { id: 100 }, //  0   100
    { id: 110, parentId: 100 }, //  1   110
    { id: 120, parentId: 100 }, //  2     120
    { id: 121, parentId: 120 }, //  3       121
    { id: 122, parentId: 120 }, //  4       122
    { id: 200 }, //  5   200
    { id: 300 }, //  6   300
    { id: 310, parentId: 300 }, //  7     310
    { id: 320, parentId: 300 }, //  8     320
    { id: 330, parentId: 300 }, //  9     330
];
testData.forEach(i => { i.childrenCount = testData.filter(x => x.parentId == i.id).length; });

describe('LazyTree', () => {
    const itemsById = (Object as any).fromEntries(testData.map(i => [i.id, i]));

    const testApiFn: LazyDataSourceApi<TestItem, number, DataQueryFilter<TestItem>> =
        (rq, ctx) => {
            rq.filter = rq.filter || {};
            rq.filter.parentId = ctx?.parent ? ctx.parent.id : undefined;
            return Promise.resolve(runDataQuery(testData, rq));
        };

    const testApi = jest.fn(testApiFn);

    let params: LazyTreeParams<TestItem, number, DataQueryFilter<TestItem>> = {
        api: testApi,
        getChildCount: i => i.childrenCount,
        getParentId: i => i.parentId,
        getId: i => i.id,
        isFolded: i => true,
    };

    let value: DataSourceState = { topIndex: 0, visibleCount: 100 };

    beforeEach(() => {
        testApi.mockClear();
    });

    function expectTreeToLookLike(
        expected: LazyTree<TestItem, number>,
        actual: LazyTree<TestItem, number>,
    ) {
        expect(expected).toEqual(actual);
    }

    it('Can load items (folded)', async () => {
        let tree = await loadLazyTree(null, params, value);
        expectTreeToLookLike(tree, {
            items: [
                { id: 100, item: itemsById[100] },
                { id: 200, item: itemsById[200] },
                { id: 300, item: itemsById[300] },
            ],
            count: 3,
            recursiveCount: 3,
            byParentKey: {},
            byKey: {
                "100": { id: 100, childrenCount: 2 },
                "200": { id: 200, childrenCount: 0 },
                "300": { id: 300, childrenCount: 3 },
            },
        });
    });

    it('Can load items (unfolded)', async () => {
        let tree = await loadLazyTree(null, { ...params, isFolded: i => false }, value);
        expect({ items: tree.items, count: tree.count, recursiveCount: tree.recursiveCount }).toEqual({
            items: [
                { id: 100, item: itemsById[100], children: {
                    items: [
                        { id: 110, item: itemsById[110] },
                        { id: 120, item: itemsById[120], children: {
                            items: [
                                { id: 121, item: itemsById[121] },
                                { id: 122, item: itemsById[122] },
                            ],
                            count: 2,
                            recursiveCount: 2,
                        } },
                    ],
                    recursiveCount: 4,
                    count: 2,
                } },
                { id: 200, item: itemsById[200] },
                { id: 300, item: itemsById[300], children: {
                    items: [
                        { id: 310, item: itemsById[310] },
                        { id: 320, item: itemsById[320] },
                        { id: 330, item: itemsById[330] },
                    ],
                    count: 3,
                    recursiveCount: 3,
                } },
            ],
            count: 3,
            recursiveCount: 10,
        });

        let tree2 = await loadLazyTree(tree, params, value);
        expect(tree2).toEqual(tree);
        expect(tree2).toBe(tree); // everything is loaded, should return exact same instance
    });

    it('should load to cache items from selection and their parents', async () => {
        let tree = await loadLazyTree(null, params, { ...value, checked: [121, 200] });

        expectTreeToLookLike(tree, {
            items: [
                { id: 100, item: itemsById[100] },
                { id: 200, item: itemsById[200] },
                { id: 300, item: itemsById[300] },
            ],
            count: 3,
            recursiveCount: 3,
            byParentKey: {
                "100": [itemsById[120]],
                "120": [itemsById[121]],
            },
            byKey: {
                "100": itemsById[100],
                "120": itemsById[120],
                "121": itemsById[121],
                "200": itemsById[200],
                "300": itemsById[300],
            },
        });
    });
});