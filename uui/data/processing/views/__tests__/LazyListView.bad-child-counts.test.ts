import { LazyDataSource } from "../../LazyDataSource";
import { LazyListView } from "../LazyListView";
import { DataSourceState, LazyDataSourceApiRequest } from "../../types";
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
        { id: 100, childrenCount: 2 },                //  0   100 // less children than specified
        { id: 110, parentId: 100 },                   //  1     110
        { id: 120, parentId: 100, childrenCount: 1 }, //  2       120    // more children than specified
        { id: 121, parentId: 120 },                   //  3         121
        { id: 122, parentId: 120 },                   //  4         122
        { id: 200, childrenCount: 1 },                //  5   200 // declared 1 child, but there's none
        { id: 300,               },                   //  6   300
        { id: 310, parentId: 300 },                   //  7     310
        { id: 320, parentId: 300 },                   //  8     320
        { id: 330, parentId: 300 },                   //  9     330
    ];

    let value: DataSourceState;
    let onValueChanged = (newValue: DataSourceState) => { value = newValue; };

    const testApi = (rq: LazyDataSourceApiRequest<TestItem, number, DataQueryFilter<TestItem>>) => Promise.resolve(runDataQuery(testData, rq));

    let treeDataSource = new LazyDataSource({
        api: (rq, ctx) => ctx.parent
            ? testApi({ ...rq, filter: { ...rq.filter, parentId: ctx.parentId }})
            : testApi({ ...rq, filter: { ...rq.filter, parentId: { isNull: true } }}),
        getChildCount: (i) => i.childrenCount,
    });

    beforeEach(() => {
        value = { topIndex: 0, visibleCount: 10 };
    });

    function expectViewToLookLike(
        view: LazyListView<TestItem, number>,
        rows: Partial<DataRowProps<TestItem, number>>[],
        rowsCount?: number,
    ) {
        let viewRows = view.getVisibleRows();
        expect(viewRows).toEqual(rows.map(r => expect.objectContaining(r)));
        let listProps = view.getListProps();
        rowsCount != null && expect(listProps.rowsCount).toEqual(rowsCount);
    }

    it.skip('can load tree, which has incorrect (probably estimated) childrenCounts', async () => {
        let ds = treeDataSource;
        let view = ds.getView(value, onValueChanged, { isFoldedByDefault: () => false });
        expectViewToLookLike(view, [
            { isLoading: true },
            { isLoading: true },
            { isLoading: true },
            { isLoading: true },
            { isLoading: true },
            { isLoading: true },
            { isLoading: true },
            { isLoading: true },
            { isLoading: true },
            { isLoading: true },
        ]);
        expect(view.getListProps().rowsCount).toBeGreaterThan(3);

        await delay();

        expectViewToLookLike(view, [
            { id: 100, depth: 1, isFoldable: true, isFolded: false },       //  0   100 // less children than specified
            { id: 110, depth: 2, isFoldable: true, isFolded: false },       //  1     110
            { id: 120, depth: 3, isFoldable: true, isFolded: false },       //  2       120   // more children than specified
            { id: 121, depth: 3 },                                          //  3         121
            { id: 122, depth: 3 },                                          //  4         122
            { id: 200, depth: 1, isFoldable: false },                       //  5   200 // declared 1 child, but there's none
            { id: 300, depth: 1 },                                          //  6   300
            { id: 310, depth: 1 },                                          //  7     310
            { id: 320, depth: 1 },                                          //  8     320
            { id: 330, depth: 1 },                                          //  9     330
        ], 10);
    });
});