import { DataSourceState, LazyDataSourceApi, DataQueryFilter } from "../../../../types";
import { runDataQuery } from '../../../querying/runDataQuery';
import { LoadTreeOptions, Tree, TreeNodeInfo } from '../tree';

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

const testDataById: Record<number, TestItem> = {};

testData.forEach(i => {
    i.childrenCount = testData.filter(x => x.parentId == i.id).length;
    testDataById[i.id] = i;
});


const blankTree = Tree.blank<TestItem, number>({
    getId: i => i.id,
    getParentId: i => i.parentId,
})

describe('Tree - load', () => {
    const itemsById = (Object as any).fromEntries(testData.map(i => [i.id, i]));

    const testApiFn: LazyDataSourceApi<TestItem, number, DataQueryFilter<TestItem>> =
        (rq, ctx) => {
            rq.filter = rq.filter || {};
            if (rq.ids) {
                rq.filter.id = { in: rq.ids };
            }
            rq.filter.parentId = ctx?.parent ? ctx.parent.id : undefined;
            const result = runDataQuery(testData, rq);
            return Promise.resolve(result);
        };

    const testApi = jest.fn(testApiFn);



    let loadParams: LoadTreeOptions<TestItem, number, DataQueryFilter<TestItem>> = {
        api: testApi,
        getChildCount: i => i.childrenCount,
        isFolded: i => true,
    };

    let value: DataSourceState = { topIndex: 0, visibleCount: 100 };

    beforeEach(() => {
        testApi.mockClear();
    });

    function expectTreeToLookLike(
        actual: Tree<TestItem, number>,
        expectedById: Record<any, TestItem>,
        expectedByParentId: Record<any, number[]>,
        expectedNodeInfos: Record<any, TreeNodeInfo>,
    ) {
        expect(Object.fromEntries(actual.byId)).toEqual(expectedById);
        expect(Object.fromEntries(actual.byParentId)).toEqual(expectedByParentId);
        expect(Object.fromEntries(actual.nodeInfoById)).toEqual(expectedNodeInfos);
    }

    it('Can load items (folded)', async () => {
        let tree = await blankTree.load(loadParams, value);
        expectTreeToLookLike(tree,
            {
                100: itemsById[100],
                200: itemsById[200],
                300: itemsById[300],
            },
            {
                "undefined": [100, 200, 300],
            },
            {
                "undefined": { count: 3 },
            }
        );

        // expect(tree.getTotalRecursiveCount()).toBe(undefined);
    });

    it('Can load items (unfolded)', async () => {
        let tree = await blankTree.load({ ...loadParams, isFolded: i => false }, value);
        expectTreeToLookLike(tree,
            testDataById,
            {
                "undefined": [100, 200, 300],
                100: [110, 120],
                120: [121, 122],
                300: [310, 320, 330],
            },
            {
                "undefined": { count: 3 },
                100: { count: 2 },
                120: { count: 2 },
                300: { count: 3 },
            }
        );
        expect(tree.getTotalRecursiveCount()).toBe(10);

        let tree2 = await tree.load(loadParams, value);
        expect(tree2).toEqual(tree);
        expect(tree2).toBe(tree); // everything is loaded, should return exact same instance
    });

    it('should load to cache items from selection and their parents', async () => {
        let tree = await blankTree.load(loadParams, { ...value, checked: [121, 200] });

        expectTreeToLookLike(tree,
            {
                100: itemsById[100],
                120: itemsById[120],
                121: itemsById[121],
                200: itemsById[200],
                300: itemsById[300],
            },
            {
                undefined: [100, 200, 300],
            },
            {
                "undefined": { count: 3 },
            }
        );
    });
});