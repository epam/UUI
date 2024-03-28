import {
    DataSourceState, DataQueryFilter, DataRowProps, IDataSourceView,
} from '../../../../types';
import { runDataQuery } from '../../../querying/runDataQuery';
import { act, delay, renderHook, waitFor } from '@epam/uui-test-utils';
import { AsyncDataSource } from '../../AsyncDataSource';

interface TestItem {
    id: number;
}

describe('AsyncListView - flat list test', () => {
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
    const testApi = () => Promise.resolve(runDataQuery(testData, {}).items);

    const getDataSource = () => new AsyncDataSource({
        api: testApi,
        getId: ({ id }) => id,
        getFilter: (filter) => ({ id }) => {
            if (!filter || filter.id?.gte === undefined) {
                return true;
            }

            return id >= filter.id.gte;
        },
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
        const flatDataSource = getDataSource();
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => flatDataSource.useView(value, onValueChange, props),
            { initialProps: { value: currentValue, onValueChange: onValueChanged, props: {} } },
        );

        let view = hookResult.result.current;
        expectViewToLookLike(view, [
            { isLoading: true }, { isLoading: true }, { isLoading: true },
        ]);

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
        const testApiWithDelay = async () => {
            await delay(500);
            return runDataQuery(testData, {}).items;
        };

        const flatDataSourceWithDelay = new AsyncDataSource({
            api: testApiWithDelay,
            getId: ({ id }) => id,
            getFilter: (filter) => ({ id }) => {
                if (!filter || filter.gte === undefined) {
                    return true;
                }
                return id >= filter.gte;
            },
        });

        const hookResult = renderHook(
            ({ value, onValueChange, props }) => flatDataSourceWithDelay.useView(value, onValueChange, props),
            { initialProps: { value: currentValue, onValueChange: onValueChanged, props: {} } },
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
            expectViewToLookLike(
                view,
                [
                    { id: 100, value: testDataById[100], depth: 0 }, { id: 110, value: testDataById[110], depth: 0 }, { id: 120, value: testDataById[120], depth: 0 },
                ],
            );
        });

        await act(() => {
            view.reload();
        });
        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { isLoading: true }, { isLoading: true }, { isLoading: true },
            ]);
        });

        await waitFor(() => {
            view = hookResult.result.current;
            expect(view.getListProps().isReloading).toBeTruthy();
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
            expectViewToLookLike(
                view,
                [
                    { id: 100, value: testDataById[100], depth: 0 }, { id: 110, value: testDataById[110], depth: 0 }, { id: 120, value: testDataById[120], depth: 0 },
                ],
            );
        });
    });

    it('handles concurrent filter updates', async () => {
        const flatDataSource = getDataSource();
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
                { id: 200 }, { id: 300 }, { id: 310 },
            ]);
        });
        expect(view.getListProps().rowsCount).toEqual(5);

        const rows = view.getVisibleRows();
        await act(() => {
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

    it('can scroll thru plain lists (no count returned from API)', async () => {
        const testApiNoCount = () =>
            Promise.resolve(testData);

        const flatDataSourceNoCount = new AsyncDataSource({
            api: testApiNoCount,
        });
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => flatDataSourceNoCount.useView(value, onValueChange, props),
            { initialProps: { value: currentValue, onValueChange: onValueChanged, props: {} } },
        );

        let view = hookResult.result.current;

        expect(view.getListProps().isReloading).toBeTruthy();
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
                { id: 110, value: testDataById[110] }, { id: 120, value: testDataById[120] }, { id: 121, value: testDataById[121] },
            ]);
        });

        expect(view.getListProps().rowsCount).toBeGreaterThan(4);

        // Scroll down to bottom
        hookResult.rerender({ value: { topIndex: 8, visibleCount: 3 }, onValueChange: onValueChanged, props: {} });

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
        const testApiNoCount = () =>
            Promise.resolve(testData);

        const flatDataSourceNoCount = new AsyncDataSource({
            api: testApiNoCount,
            getFilter: (filter) => ({ id }) => filter?.id === id,
        });

        currentValue.filter = { id: -100500 };
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => flatDataSourceNoCount.useView(value, onValueChange, props),
            { initialProps: { value: { visibleCount: 3 }, onValueChange: onValueChanged, props: {} } },
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
