import { LazyDataSource } from '../../LazyDataSource';
import { delay, renderHook, waitFor } from '@epam/uui-test-utils';

import {
    DataSourceState, LazyDataSourceApiRequest, DataQueryFilter, DataRowProps, IDataSourceView,
} from '../../../../types';
import { runDataQuery } from '../../../querying/runDataQuery';

interface TestItem {
    id: number;
    parentId?: number;
    childrenCount?: number;
}

describe('LazyListView - cursors support', () => {
    const testData: TestItem[] = [
        { id: 100 },
        { id: 110, parentId: 100 },
        { id: 200 },
        { id: 300 },
        { id: 310, parentId: 300 },
        { id: 320, parentId: 300 },
        { id: 330, parentId: 300 },
        { id: 340, parentId: 300 },
        { id: 350, parentId: 300 },
        { id: 360, parentId: 300 },
        { id: 400 },
        { id: 500 },
        { id: 600 },
        { id: 700 },
        { id: 800 },
        { id: 900 },
    ];

    testData.forEach((i) => {
        i.childrenCount = testData.filter((x) => x.parentId === i.id).length;
    });

    const testDataById = (Object as any).fromEntries(testData.map((i) => [i.id, i]));

    let currentValue: DataSourceState;
    let onValueChanged = (newValue: React.SetStateAction<DataSourceState<Record<string, any>, any>>) => {
        if (typeof newValue === 'function') {
            currentValue = newValue(currentValue);
            return;
        }
        currentValue = newValue;
    };

    const testApi = jest.fn(async (rq: LazyDataSourceApiRequest<TestItem, number, DataQueryFilter<TestItem>>) => {
        rq.sorting = [{ field: 'id', direction: 'asc' }];
        rq.range = { from: 0, count: rq.range?.count };

        rq.filter = rq.filter ?? {};
        if (rq.cursor) {
            rq.filter.id = { gt: rq.cursor };
        }

        const result = runDataQuery(testData, rq);

        if (result.items.length > 0) {
            result.cursor = result.items[result.items.length - 1].id;
        }

        delete result.count;

        await delay(1);

        return result;
    });

    const treeDataSource = new LazyDataSource({
        api: (rq, ctx) =>
            ctx?.parent ? testApi({ ...rq, filter: { ...rq.filter, parentId: ctx.parentId } }) : testApi({ ...rq, filter: { ...rq.filter, parentId: { isNull: true } } }),
        getChildCount: (i) => i.childrenCount,
        getParentId: (i) => i.parentId,
    });

    beforeEach(() => {
        currentValue = { topIndex: 0, visibleCount: 3 };
        onValueChanged = (newValue: React.SetStateAction<DataSourceState<Record<string, any>, any>>) => {
            if (typeof newValue === 'function') {
                currentValue = newValue(currentValue);
                return;
            }
            currentValue = newValue;
        };
        testApi.mockClear();
    });

    it('testApi is ok', async () => {
        const data = await testApi({ filter: { parentId: 300 }, cursor: 310, range: { from: 3, count: 2 } });
        expect(data).toEqual({
            items: [testDataById[320], testDataById[330]],
            cursor: 330,
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

    it('can load list using cursors', async () => {
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => treeDataSource.useView(value, onValueChange, props),
            { initialProps: { value: currentValue, onValueChange: onValueChanged, props: {} } },
        );

        let view = hookResult.result.current;
        expectViewToLookLike(view, [
            { isLoading: true, depth: 0, indent: 0 },
            { isLoading: true, depth: 0, indent: 0 },
            { isLoading: true, depth: 0, indent: 0 },
        ]);

        await waitFor(() => {
            expect(testApi).toBeCalledTimes(1);
        });
        testApi.mockClear();

        view = hookResult.result.current;
        expectViewToLookLike(view, [
            { id: 100, isFoldable: true, isFolded: true },
            { id: 200, isFoldable: false },
            { id: 300, isFoldable: true, isFolded: true },
        ]);

        // Load more rows

        hookResult.rerender({ value: { ...currentValue, topIndex: 0, visibleCount: 6 }, onValueChange: onValueChanged, props: {} });
        view = hookResult.result.current;

        expectViewToLookLike(view, [
            { id: 100, isFoldable: true, isFolded: true },
            { id: 200, isFoldable: false },
            { id: 300, isFoldable: true, isFolded: true },
            { isLoading: true },
            { isLoading: true },
            { isLoading: true },
        ]);

        let listProps = view.getListProps();
        expect(listProps.knownRowsCount).toBe(6);

        await waitFor(() => {
            expect(testApi).toBeCalledTimes(1);
        });
        testApi.mockClear();

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 100, isFoldable: true, isFolded: true },
                { id: 200, isFoldable: false },
                { id: 300, isFoldable: true, isFolded: true },
                { id: 400, isFoldable: false },
                { id: 500, isFoldable: false },
                { id: 600, isFoldable: false },
            ]);
        });

        listProps = view.getListProps();
        expect(listProps.knownRowsCount).toBe(6);

        // Load last rows

        hookResult.rerender({ value: { ...currentValue, topIndex: 5, visibleCount: 5 }, onValueChange: onValueChanged, props: {} });

        view = hookResult.result.current;

        expectViewToLookLike(view, [
            { id: 600, isFoldable: false },
            { isLoading: true },
            { isLoading: true },
            { isLoading: true },
            { isLoading: true },
        ]);

        await waitFor(() => {
            expect(testApi).toBeCalledTimes(1);
        });
        testApi.mockClear();
        view = hookResult.result.current;
        expectViewToLookLike(view, [
            { id: 600, isFoldable: false },
            { id: 700, isFoldable: false },
            { id: 800, isFoldable: false },
            { id: 900, isFoldable: false },
        ]);

        listProps = view.getListProps();
        expect(listProps.knownRowsCount).toBe(9);
    });

    it('can load child nodes with cursor', async () => {
        currentValue.folded = { 300: false };
        currentValue.visibleCount = 5;

        const hookResult = renderHook(
            ({ value, onValueChange, props }) => treeDataSource.useView(value, onValueChange, props),
            { initialProps: { value: currentValue, onValueChange: onValueChanged, props: {} } },
        );

        await waitFor(() => {
            expect(testApi).toBeCalledTimes(2);
        });
        testApi.mockClear();

        hookResult.rerender({ value: { ...currentValue }, onValueChange: onValueChanged, props: {} });

        let view = hookResult.result.current;

        expectViewToLookLike(view, [
            { id: 100, isFoldable: true, isFolded: true },
            { id: 200, isFoldable: false },
            { id: 300, isFoldable: true, isFolded: false },
            { id: 310, isFoldable: false, parentId: 300 },
            { id: 320, isFoldable: false, parentId: 300 },
        ]);

        hookResult.rerender({ value: { ...currentValue, topIndex: 5 }, onValueChange: onValueChanged, props: {} });

        await waitFor(() => {
            expect(testApi).toBeCalledTimes(2);
        });
        testApi.mockClear();

        view = hookResult.result.current;

        expectViewToLookLike(view, [
            { id: 330, isFoldable: false, parentId: 300 },
            { id: 340, isFoldable: false, parentId: 300 },
            { id: 350, isFoldable: false, parentId: 300 },
            { id: 360, isFoldable: false, parentId: 300 },
            { id: 400, isFoldable: false },
        ]);
    });

    it('works if end of the list happen to match batch boundaries', async () => {
        currentValue.topIndex = 5;
        currentValue.visibleCount = 4;
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => treeDataSource.useView(value, onValueChange, props),
            { initialProps: { value: currentValue, onValueChange: onValueChanged, props: {} } },
        );

        await waitFor(() => {
            expect(testApi).toBeCalledTimes(1);
        });
        testApi.mockClear();

        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

        let view = hookResult.result.current;
        expectViewToLookLike(view, [
            { id: 600, isFoldable: false },
            { id: 700, isFoldable: false },
            { id: 800, isFoldable: false },
            { id: 900, isFoldable: false },
        ]);

        // Scroll down. No more rows exists, and this should be handled correctly.

        currentValue.topIndex = 5;
        currentValue.visibleCount = 5;

        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

        await waitFor(() => {
            expect(testApi).toBeCalledTimes(1);
        });
        testApi.mockClear();

        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

        view = hookResult.result.current;
        expectViewToLookLike(view, [
            { id: 600, isFoldable: false },
            { id: 700, isFoldable: false },
            { id: 800, isFoldable: false },
            { id: 900, isFoldable: false },
        ]);

        const listProps = view.getListProps();
        expect(listProps.knownRowsCount).toBe(9);
    });
});
