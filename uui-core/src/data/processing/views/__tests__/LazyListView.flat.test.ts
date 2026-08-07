import { LazyDataSource } from '../../LazyDataSource';
import {
    DataSourceState, LazyDataSourceApiRequest, DataQueryFilter, DataRowProps, IDataSourceView,
} from '../../../../types';
import { runDataQuery } from '../../../querying/runDataQuery';
import { act, renderHook, waitFor } from '@epam/uui-test-utils';

interface TestItem {
    id: number;
}

describe('LazyListView - flat list test', () => {
    const testData: TestItem[] = [
        { id: 100 }, { id: 110 }, { id: 120 }, { id: 121 }, { id: 122 }, { id: 200 }, { id: 300 }, { id: 310 }, { id: 320 }, { id: 330 },
    ];

    const testDataById = (Object as any).fromEntries(testData.map((i) => [i.id, i]));

    let currentValue: DataSourceState<DataQueryFilter<TestItem>, number>;
    let onValueChanged = (newValue: React.SetStateAction<DataSourceState<DataQueryFilter<TestItem>, number>>) => {
        if (typeof newValue === 'function') {
            currentValue = newValue(currentValue);
            return;
        }
        currentValue = newValue;
    };
    const testApi = (rq: LazyDataSourceApiRequest<TestItem, number, DataQueryFilter<TestItem>>) => Promise.resolve(runDataQuery(testData, rq));

    const flatDataSource = new LazyDataSource({
        api: testApi,
    });

    beforeEach(() => {
        currentValue = { topIndex: 0, visibleCount: 3 };
        onValueChanged = (newValue) => {
            if (typeof newValue === 'function') {
                currentValue = newValue(currentValue);
                return;
            }
            currentValue = newValue;
        };
    });

    function expectViewToLookLike(
        view: IDataSourceView<TestItem, number, DataQueryFilter<TestItem>>,
        rows: Partial<DataRowProps<TestItem, number>>[],
    ) {
        const viewRows = view.getVisibleRows();
        expect(viewRows).toEqual(rows.map((r) => expect.objectContaining(r)));
    }

    it('can scroll through plain lists', async () => {
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => flatDataSource.useView(value, onValueChange, props),
            { initialProps: { value: currentValue, onValueChange: onValueChanged, props: {} } },
        );

        await waitFor(() => {
            const view = hookResult.result.current;

            expectViewToLookLike(view, [
                { isLoading: true }, { isLoading: true }, { isLoading: true },
            ]);
        });

        let view = hookResult.result.current;
        expect(view.getListProps().rowsCount).toBeGreaterThan(3);

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { id: 100, value: testDataById[100], depth: 0 }, { id: 110, value: testDataById[110], depth: 0 }, { id: 120, value: testDataById[120], depth: 0 },
                ],
            );
        });

        view = hookResult.result.current;
        let listProps = view.getListProps();
        expect(listProps.rowsCount).toEqual(10);

        // Scroll down by 1 row
        hookResult.rerender({ value: { topIndex: 1, visibleCount: 3 }, onValueChange: onValueChanged, props: {} });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 110, value: testDataById[110] }, { id: 120, value: testDataById[120] }, { isLoading: true },
            ]);
        });

        view = hookResult.result.current;
        listProps = view.getListProps();
        expect(listProps.rowsCount).toEqual(10);

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { id: 110, value: testDataById[110] }, { id: 120, value: testDataById[120] }, { id: 121, value: testDataById[121] },
                ],
            );
        });

        view = hookResult.result.current;
        listProps = view.getListProps();
        expect(listProps.rowsCount).toEqual(10);

        // Scroll down to bottom
        hookResult.rerender({ value: { topIndex: 8, visibleCount: 3 }, onValueChange: onValueChanged, props: {} });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [{ isLoading: true }, { isLoading: true }]);
        });

        view = hookResult.result.current;
        listProps = view.getListProps();
        expect(listProps.rowsCount).toEqual(10);

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [{ id: 320, value: testDataById[320] }, { id: 330, value: testDataById[330] }],
            );
        });

        view = hookResult.result.current;
        listProps = view.getListProps();
        expect(listProps.rowsCount).toEqual(10);
    });

    it('can reload', async () => {
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => flatDataSource.useView(value, onValueChange, props),
            { initialProps: { value: currentValue, onValueChange: onValueChanged, props: {} } },
        );
        let view = hookResult.result.current;

        act(() => view.reload());

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { isLoading: true }, { isLoading: true }, { isLoading: true },
            ]);
        });

        expect(view.getListProps().rowsCount).toBeGreaterThan(3);

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { id: 100, value: testDataById[100], depth: 0 }, { id: 110, value: testDataById[110], depth: 0 }, { id: 120, value: testDataById[120], depth: 0 },
                ],
            );
        });

        // Scroll down by 1 row
        hookResult.rerender({ value: { topIndex: 1, visibleCount: 3 }, onValueChange: onValueChanged, props: {} });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 110, value: testDataById[110] }, { id: 120, value: testDataById[120] }, { isLoading: true },
            ]);
        });
        expect(view.getListProps().rowsCount).toEqual(10);
    });

    it('handles concurrent filter updates', async () => {
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => flatDataSource.useView(value, onValueChange, props),
            { initialProps: { value: currentValue, onValueChange: onValueChanged, props: {} } },
        );
        let view = hookResult.result.current;

        // immediately set another filter and query again
        currentValue = { ...currentValue, filter: { id: { gte: 200 } } };

        hookResult.rerender({
            value: currentValue,
            onValueChange: onValueChanged,
            props: {
                getRowOptions: () => ({ checkbox: { isVisible: true } }),
            },
        });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { isLoading: true }, { isLoading: true }, { isLoading: true },
            ]);
        });

        expect(view.getListProps().rowsCount).toBeGreaterThan(3);

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 200 }, { id: 300 }, { id: 310 },
            ]);
        });
        expect(view.getListProps().rowsCount).toEqual(5);

        const rows = view.getVisibleRows();
        await act(async () => {
            rows[0].onCheck?.(rows[0]);
        });

        hookResult.rerender({
            value: currentValue,
            onValueChange: onValueChanged,
            props: {
                getRowOptions: () => ({ checkbox: { isVisible: true } }),
            },
        });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 200, isChecked: true }, { id: 300 }, { id: 310 },
            ]);
        });
        expect(view.getListProps().rowsCount).toEqual(5);
    });

    it('should not apply stale response when old request resolves after newer request', async () => {
        let resolveFirst!: (value: any) => void;
        let resolveSecond!: (value: any) => void;

        const deferred1 = new Promise<any>((resolve) => { resolveFirst = resolve; });
        const deferred2 = new Promise<any>((resolve) => { resolveSecond = resolve; });

        // First call (no filter) → deferred1; second call (filter set) → deferred2
        const racingApi = jest.fn().mockImplementation(
            (rq: LazyDataSourceApiRequest<TestItem, number, DataQueryFilter<TestItem>>) => (
                rq.filter?.id !== undefined ? deferred2 : deferred1
            ),
        );

        const racingDS = new LazyDataSource<TestItem, number, DataQueryFilter<TestItem>>({ api: racingApi });

        const hookResult = renderHook(
            ({ value, onValueChange }) => racingDS.useView(value, onValueChange, {}),
            { initialProps: { value: currentValue, onValueChange: onValueChanged } },
        );

        // Wait for the first (no-filter) request to be in-flight
        await waitFor(() => expect(racingApi).toHaveBeenCalledTimes(1));

        // Change filter before the first request resolves — triggers abortInProgress + generationRef++
        currentValue = { ...currentValue, filter: { id: { gte: 200 } } };
        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged });

        // Wait for the second (filtered) request to start
        await waitFor(() => expect(racingApi).toHaveBeenCalledTimes(2));

        // Resolve the NEWER request first — correct result for the active filter
        act(() => resolveSecond({ items: [{ id: 200 }], count: 1 }));

        await waitFor(() => {
            const view = hookResult.result.current;
            expectViewToLookLike(view, [{ id: 200 }]);
        });

        // Resolve the OLDER (stale) request and flush the full async chain:
        // deferred1 → tree.load() → loadMissingImpl → .then(setTreeWithData)
        await act(async () => {
            resolveFirst({ items: [{ id: 100 }], count: 1 });
            for (let i = 0; i < 10; i++) {
                await Promise.resolve();
            }
        });

        // Stale result must not overwrite the current view
        const view = hookResult.result.current;
        expectViewToLookLike(view, [{ id: 200 }]);
    });

    it('aborts the previous AbortSignal when filter changes', async () => {
        const abortedSignals: AbortSignal[] = [];

        const trackingApi = jest.fn().mockImplementation(
            async (_rq: LazyDataSourceApiRequest<TestItem, number, DataQueryFilter<TestItem>>, ctx: { signal?: AbortSignal }) => {
                const signal = ctx?.signal;
                if (signal) {
                    signal.addEventListener('abort', () => abortedSignals.push(signal));
                }
                // Keep the request pending so the signal can be aborted before it resolves
                await new Promise(() => {});
            },
        );

        const ds = new LazyDataSource<TestItem, number, DataQueryFilter<TestItem>>({
            api: trackingApi,
        });

        const hookResult = renderHook(
            ({ value, onValueChange }) => ds.useView(value, onValueChange, {}),
            { initialProps: { value: currentValue, onValueChange: onValueChanged } },
        );

        // Wait for the first request to be in-flight
        await waitFor(() => expect(trackingApi).toHaveBeenCalledTimes(1));

        // Change filter — should abort the first request's signal
        currentValue = { ...currentValue, filter: { id: { gte: 200 } } };
        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged });

        await waitFor(() => expect(abortedSignals).toHaveLength(1));
        expect(abortedSignals[0].aborted).toBe(true);
    });

    it('applies the filter from props', async () => {
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => flatDataSource.useView(value, onValueChange, props),
            { initialProps: { value: currentValue, onValueChange: onValueChanged, props: { filter: { id: { gte: 320 } } } } },
        );
        let view = hookResult.result.current;

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [{ id: 320 }, { id: 330 }]);
        });
        expect(view.getListProps().rowsCount).toEqual(2);
    });

    const testApiNoCount = (rq: LazyDataSourceApiRequest<TestItem, number, DataQueryFilter<TestItem>>) =>
        Promise.resolve({ ...runDataQuery(testData, rq), count: undefined });

    const flatDataSourceNoCount = new LazyDataSource({
        api: testApiNoCount,
    });

    it('can scroll thru plain lists (no count returned from API)', async () => {
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => flatDataSourceNoCount.useView(value, onValueChange, props),
            { initialProps: { value: currentValue, onValueChange: onValueChanged, props: {} } },
        );

        let view = hookResult.result.current;

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { isLoading: true }, { isLoading: true }, { isLoading: true },
            ]);
        });

        expect(view.getListProps().rowsCount).toBeGreaterThan(3);

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 100, value: testDataById[100], depth: 0 }, { id: 110, value: testDataById[110], depth: 0 }, { id: 120, value: testDataById[120], depth: 0 },
            ]);
        });

        expect(view.getListProps().rowsCount).toBeGreaterThan(3);

        // Scroll down by 1 row
        hookResult.rerender({ value: { topIndex: 1, visibleCount: 3 }, onValueChange: onValueChanged, props: {} });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 110, value: testDataById[110] }, { id: 120, value: testDataById[120] }, { isLoading: true },
            ]);
        });

        expect(view.getListProps().rowsCount).toBeGreaterThan(4);

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 110, value: testDataById[110] }, { id: 120, value: testDataById[120] }, { id: 121, value: testDataById[121] },
            ]);
        });

        expect(view.getListProps().rowsCount).toBeGreaterThan(4);

        // Scroll down to bottom
        hookResult.rerender({ value: { topIndex: 8, visibleCount: 3 }, onValueChange: onValueChanged, props: {} });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { isLoading: true }, { isLoading: true }, { isLoading: true },
            ]);
        });

        expect(view.getListProps().rowsCount).toBeGreaterThan(11);
        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [{ id: 320, value: testDataById[320] }, { id: 330, value: testDataById[330] }],
            ); // correctly detected the end of the list
        });

        expect(view.getListProps().rowsCount).toEqual(10);
    });

    it('handles empty result', async () => {
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => flatDataSourceNoCount.useView(value, onValueChange, props),
            { initialProps: { value: { visibleCount: 3, filter: { id: -100500 } }, onValueChange: onValueChanged, props: {} } },
        );
        await waitFor(() => {
            const view = hookResult.result.current;
            expectViewToLookLike(view, [
                { isLoading: true }, { isLoading: true }, { isLoading: true },
            ]);
        });
        let view = hookResult.result.current;

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, []);
        });

        expect(view.getListProps().rowsCount).toBe(0);
    });
});
