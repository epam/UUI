import { LazyDataSource } from '../../LazyDataSource';
import {
    DataSourceState, LazyDataSourceApi, DataQueryFilter, DataRowProps, IDataSourceView,
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

    testData.forEach((i) => {
        i.childrenCount = testData.filter((x) => x.parentId === i.id).length;
    });

    const testDataById = (Object as any).fromEntries(testData.map((i) => [i.id, i]));

    let currentValue: DataSourceState;
    const onValueChanged = (newValue: React.SetStateAction<DataSourceState<Record<string, any>, any>>) => {
        if (typeof newValue === 'function') {
            currentValue = newValue(currentValue);
            return;
        }
        currentValue = newValue;
    };

    const testApiFn: LazyDataSourceApi<TestItem, number, DataQueryFilter<TestItem>> = (rq) => {
        const result = runDataQuery(testData, rq);
        return Promise.resolve({ items: result.items });
    };

    const testApi = jest.fn(testApiFn);

    const treeDataSource = new LazyDataSource({
        api: (rq, ctx) =>
            ctx?.parent ? testApi({ ...rq, filter: { ...rq.filter, parentId: ctx.parentId } }) : testApi({ ...rq, filter: { ...rq.filter, parentId: { isNull: true } } }),
        getChildCount: (i) => i.childrenCount,
    });

    beforeEach(() => {
        currentValue = { topIndex: 0, visibleCount: 3 };
        testApi.mockClear();
    });

    it('testApi is ok', async () => {
        const data = await testApi({ filter: { parentId: 100 } });
        expect(data).toEqual({
            items: [testDataById[110], testDataById[120]],
        });
    });

    function expectViewToLookLike(
        view: IDataSourceView<TestItem, number, DataQueryFilter<TestItem>>,
        rows: Partial<DataRowProps<TestItem, number>>[],
    ) {
        const viewRows = view.getVisibleRows();

        rows.forEach((r) => {
            if (r.id) {
                r.value = testDataById[r.id];
            }
        });

        expect(viewRows).toEqual(rows.map((r) => expect.objectContaining(r)));
    }

    it('can load tree, unfold nodes, and scroll down', async () => {
        const viewProps: Partial<LazyListViewProps<TestItem, number, DataQueryFilter<TestItem>>> = {
            getParentId: ({ parentId }) => parentId,
        };

        const hookResult = renderHook(
            ({ value, onValueChange, props }) => treeDataSource.useView(value, onValueChange, props),
            { initialProps: { value: currentValue, onValueChange: onValueChanged, props: viewProps } },
        );

        let view;
        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [{ isLoading: true }, { isLoading: true }, { isLoading: true }]);
        });

        expect(view.getListProps().rowsCount).toBeGreaterThan(3);

        expect(testApi).toBeCalledTimes(1);
        testApi.mockClear();
        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 100, isFoldable: true, isFolded: true }, { id: 200, isFoldable: false }, { id: 300, isFoldable: true, isFolded: true },
            ]);
        });

        view = hookResult.result.current;
        expect(view.getListProps().rowsCount).toBeGreaterThan(3); // actually read all items, but we don't know if that's the end of the list

        // scroll 1 row down
        hookResult.rerender({ value: { ...currentValue, topIndex: 1 }, onValueChange: onValueChanged, props: {} });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 200, isFoldable: false }, { id: 300, isFoldable: true, isFolded: true }, { isLoading: true },
            ]);
        });

        expect(view.getListProps().rowsCount).toBeGreaterThan(4);

        expect(testApi).toBeCalledTimes(1);
        testApi.mockClear();

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 200, isFoldable: false }, { id: 300, isFoldable: true, isFolded: true },
            ]);
        });

        expect(view.getListProps().rowsCount).toBe(3); // now we know that item #4 doesn't exists, so we know count

        // scroll top
        hookResult.rerender({ value: { ...currentValue, topIndex: 0, visibleCount: 6 }, onValueChange: onValueChanged, props: {} });

        await waitFor(() => {
            view = hookResult.result.current;
            const rows = view.getVisibleRows();
            expect(typeof rows[0].onFold).toEqual('function');
        });
        view = hookResult.result.current;
        const rows = view.getVisibleRows();

        // unfold first row
        rows[0].onFold(rows[0]);
        hookResult.rerender({ value: { ...currentValue, topIndex: 0, visibleCount: 6 }, onValueChange: onValueChanged, props: {} });
        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 100 }, { isLoading: true }, { isLoading: true }, { id: 200 }, { id: 300 },
            ]);
        });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 100, isFolded: false, depth: 0, isFoldable: true },
                { id: 110, depth: 1, isFoldable: false },
                { id: 120, depth: 1, isFoldable: true },
                { id: 200, depth: 0 },
                { id: 300, depth: 0 },
            ]);
        });
    });
});
