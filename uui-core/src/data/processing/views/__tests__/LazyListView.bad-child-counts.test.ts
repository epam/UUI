import { LazyDataSource } from '../../LazyDataSource';
import {
    DataSourceState, LazyDataSourceApiRequest, DataQueryFilter, DataRowProps, IDataSourceView,
} from '../../../../types';
import { runDataQuery } from '../../../querying/runDataQuery';
import { renderHook, waitFor } from '@epam/uui-test-utils';
import { LazyListViewProps } from '../types';

interface TestItem {
    id: number;
    parentId?: number;
    childrenCount?: number;
}

describe('LazyListView', () => {
    const testData: TestItem[] = [
        { id: 100, childrenCount: 3 }, //  0   100 // less children than specified
        { id: 110, parentId: 100 }, //  1     110
        { id: 120, parentId: 100, childrenCount: 1 }, //  2     120    // more actual children than specified
        { id: 121, parentId: 120 }, //  3       121
        { id: 122, parentId: 120 }, //  4       122
        { id: 200, childrenCount: 1 }, //  5   200 // declared 1 child, but there's none
        { id: 300, childrenCount: 1 }, //  6   300 //
        { id: 310, parentId: 300 }, //  7     310
        { id: 320, parentId: 300 }, //  8     320
        { id: 330, parentId: 300 }, //  9     330
    ];

    let currentValue: DataSourceState;
    const onValueChanged = (newValue: React.SetStateAction<DataSourceState<Record<string, any>, any>>) => {
        if (typeof newValue === 'function') {
            currentValue = newValue(currentValue);
            return;
        }
        currentValue = newValue;
    };

    let viewProps: Partial<LazyListViewProps<TestItem, number, DataQueryFilter<TestItem>>>;

    const testApi = (rq: LazyDataSourceApiRequest<TestItem, number, DataQueryFilter<TestItem>>) => Promise.resolve(runDataQuery(testData, rq));

    const treeDataSource = new LazyDataSource({
        api: (rq, ctx) =>
            ctx?.parent ? testApi({ ...rq, filter: { ...rq.filter, parentId: ctx.parentId } }) : testApi({ ...rq, filter: { ...rq.filter, parentId: { isNull: true } } }),
        getChildCount: (i) => i.childrenCount,
    });

    beforeEach(() => {
        currentValue = { topIndex: 0, visibleCount: 10 };
    });

    function expectViewToLookLike(view: IDataSourceView<TestItem, number, any>, rows: Partial<DataRowProps<TestItem, number>>[], rowsCount?: number) {
        const viewRows = view.getVisibleRows();
        expect(viewRows).toEqual(rows.map((r) => expect.objectContaining(r)));
        const listProps = view.getListProps();
        rowsCount != null && expect(listProps.rowsCount).toEqual(rowsCount);
    }

    it('can load tree, which has incorrect (probably estimated) childrenCounts', async () => {
        const ds = treeDataSource;
        viewProps = { isFoldedByDefault: () => false, getParentId: ({ parentId }) => parentId };
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => ds.useView(value, onValueChange, props),
            { initialProps: { value: currentValue, onValueChange: onValueChanged, props: viewProps } },
        );

        await waitFor(() => {
            const view = hookResult.result.current;
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
        });

        let view = hookResult.result.current;
        expect(view.getListProps().rowsCount).toBeGreaterThan(3);

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    {
                        id: 100, depth: 0, isFoldable: true, isFolded: false,
                    }, //  0   100 // less children than specified
                    { id: 110, depth: 1, isFoldable: false }, //  1     110
                    {
                        id: 120, depth: 1, isFoldable: true, isFolded: false,
                    }, //  2       120   // more children than specified
                    { id: 121, depth: 2 }, //  3         121
                    { id: 122, depth: 2 }, //  4         122
                    { id: 200, depth: 0, isFoldable: false }, //  5   200 // declared 1 child, but there's none
                    { id: 300, depth: 0 }, //  6   300
                    { id: 310, depth: 1 }, //  7     310
                    { id: 320, depth: 1 }, //  8     320
                    { id: 330, depth: 1 }, //  9     330
                ],
            );
        });

        expect(view.getListProps().rowsCount).toEqual(10);
    });
});
