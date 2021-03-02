import { LazyDataSource } from "../../LazyDataSource";
import { LazyListView } from "../LazyListView";
import { DataSourceState, LazyDataSourceApi } from "../../types";
import { runDataQuery } from '../../../querying/runDataQuery';
import { DataQueryFilter, DataRowProps } from '../../../..';

const delay = () => new Promise(resolve => setTimeout(resolve, 1));

interface TestItem {
    id: number;
    parentId?: number;
    childrenCount?: number;
}

describe('LazyListView', () => {
    const testData: TestItem[] = [
        { id: 100,               }, //  0   100
        { id: 110, parentId: 100 }, //  1   110
        { id: 120, parentId: 100 }, //  2     120
        { id: 121, parentId: 120 }, //  3       121
        { id: 122, parentId: 120 }, //  4       122
        { id: 200,               }, //  5   200
        { id: 300,               }, //  6   300
        { id: 310, parentId: 300 }, //  7     310
        { id: 320, parentId: 300 }, //  8     320
        { id: 330, parentId: 300 }, //  9     330
    ];

    testData.forEach(i => { i.childrenCount = testData.filter(x => x.parentId == i.id).length; });

    const testDataById = (Object as any).fromEntries(testData.map(i => [i.id, i]));

    let value: DataSourceState;
    let onValueChanged = (newValue: DataSourceState) => { value = newValue; };

    const testApiFn: LazyDataSourceApi<TestItem, number, DataQueryFilter<TestItem>> =
        (rq) => {
            const result = runDataQuery(testData, rq);
            return Promise.resolve({ items: result.items });
        };

    const testApi = jest.fn(testApiFn);

    let treeDataSource = new LazyDataSource({
        api: (rq, ctx) => ctx.parent
            ? testApi({ ...rq, filter: { ...rq.filter, parentId: ctx.parentId }})
            : testApi({ ...rq, filter: { ...rq.filter, parentId: { isNull: true } }}),
        getChildCount: (i) => i.childrenCount,
    });

    beforeEach(() => {
        value = { topIndex: 0, visibleCount: 3 };
        testApi.mockClear();
    });

    it('testApi is ok', async () => {
        let data = await testApi({ filter: { parentId: 100 }});
        expect(data).toEqual({
            items: [
                testDataById[110],
                testDataById[120],
            ],
        })
    });

    function expectViewToLookLike(
        view: LazyListView<TestItem, number>,
        rows: Partial<DataRowProps<TestItem, number>>[],
        rowsCount?: number,
    ) {
        let viewRows = view.getVisibleRows();

        rows.forEach(r => {
            if (r.id) {
                r.value = testDataById[r.id];
            }
        });

        expect(viewRows).toEqual(rows.map(r => expect.objectContaining(r)));
        let listProps = view.getListProps();
        rowsCount != null && expect(listProps.rowsCount).toEqual(rowsCount);
    }

    it('can load tree, unfold nodes, and scroll down', async () => {
        let ds = treeDataSource;
        let view = ds.getView(value, onValueChanged, {});
        expectViewToLookLike(view, [
            { isLoading: true },
            { isLoading: true },
            { isLoading: true },
        ]);
        expect(view.getListProps().rowsCount).toBeGreaterThan(3);

        await delay();
        expect(testApi).toBeCalledTimes(1);
        testApi.mockClear();

        expectViewToLookLike(view, [
            { id: 100, isFoldable: true, isFolded: true },
            { id: 200, isFoldable: false },
            { id: 300, isFoldable: true, isFolded: true },
        ]);
        expect(view.getListProps().rowsCount).toBeGreaterThan(3); // actually read all items, but we don't know if that's the end of the list

        // scroll 1 row down
        value.topIndex = 1;
        view = ds.getView(value, onValueChanged, {});
        expectViewToLookLike(view, [
            { id: 200, isFoldable: false },
            { id: 300, isFoldable: true, isFolded: true },
            { isLoading: true },
        ]);
        expect(view.getListProps().rowsCount).toBeGreaterThan(4);

        await delay();
        expect(testApi).toBeCalledTimes(1);
        testApi.mockClear();

        expectViewToLookLike(view, [
            { id: 200, isFoldable: false },
            { id: 300, isFoldable: true, isFolded: true },
        ]);
        expect(view.getListProps().rowsCount).toBe(3); // now we know that item #4 doesn't exists, so we know count

        // scroll top
        value.topIndex = 0;
        value.visibleCount = 6;
        view = ds.getView(value, onValueChanged, {});
        let rows = view.getVisibleRows();

        // unfold first row
        rows[0].onFold(rows[0]);
        view = ds.getView(value, onValueChanged, {});
        expectViewToLookLike(view, [
            { id: 100         },
            { isLoading: true },
            { isLoading: true },
            { id: 200         },
            { id: 300         },
        ], 5); // even we don't know if there are children of a children of #100, we understand that there's no row below 300, so we need to recieve exact rows count here

        await delay();

        expectViewToLookLike(view, [
            { id: 100, isFolded: false, depth: 1, isFoldable: true },
            { id: 110, depth: 2, isFoldable: false },
            { id: 120, depth: 2, isFoldable: true },
            { id: 200, depth: 1 },
            { id: 300, depth: 1 },
        ], 5);
    });
});