import { LazyDataSource } from '../../LazyDataSource';
import { LazyListView } from '../LazyListView';
import {
    DataSourceState, LazyDataSourceApiRequest, DataQueryFilter, DataRowProps, IEditable,
} from '../../../../types';
import { runDataQuery } from '../../../querying/runDataQuery';
import { delay, renderHook } from '@epam/uui-test-utils';

interface TestItem {
    id: number;
}

describe('LazyListView - flat list test', () => {
    const testData: TestItem[] = [
        { id: 100 }, { id: 110 }, { id: 120 }, { id: 121 }, { id: 122 }, { id: 200 }, { id: 300 }, { id: 310 }, { id: 320 }, { id: 330 },
    ];

    const testDataById = (Object as any).fromEntries(testData.map((i) => [i.id, i]));

    let { value: currentValue, onValueChange: onValueChanged }: IEditable<DataSourceState<DataQueryFilter<TestItem>, number>> = {} as any;

    const testApi = (rq: LazyDataSourceApiRequest<TestItem, number, DataQueryFilter<TestItem>>) => Promise.resolve(runDataQuery(testData, rq));

    const flatDataSource = new LazyDataSource({
        api: testApi,
    });

    beforeEach(() => {
        currentValue = { topIndex: 0, visibleCount: 3 };
        onValueChanged = (newValue) => {
            currentValue = newValue;
        };
    });

    function expectViewToLookLike(view: LazyListView<TestItem, number>, rows: Partial<DataRowProps<TestItem, number>>[], rowsCount?: number) {
        const viewRows = view.getVisibleRows();
        expect(viewRows).toEqual(rows.map((r) => expect.objectContaining(r)));
        const listProps = view.getListProps();
        rowsCount != null && expect(listProps.rowsCount).toEqual(rowsCount);
    }

    it('can scroll through plain lists', async () => {
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => flatDataSource.useView(value, onValueChange, props),
            { initialProps: { value: currentValue, onValueChange: onValueChanged, props: {} } },
        );
        const view = hookResult.result.current;

        expectViewToLookLike(view, [
            { isLoading: true }, { isLoading: true }, { isLoading: true },
        ]);
        expect(view.getListProps().rowsCount).toBeGreaterThan(3);

        await delay();

        expectViewToLookLike(
            view,
            [
                { id: 100, value: testDataById[100], depth: 0 }, { id: 110, value: testDataById[110], depth: 0 }, { id: 120, value: testDataById[120], depth: 0 },
            ],
            10,
        );

        // Scroll down by 1 row
        hookResult.rerender({ value: { topIndex: 1, visibleCount: 3 }, onValueChange: onValueChanged, props: {} });

        expectViewToLookLike(view, [
            { id: 110, value: testDataById[110] }, { id: 120, value: testDataById[120] }, { isLoading: true },
        ], 10);

        await delay();

        expectViewToLookLike(
            view,
            [
                { id: 110, value: testDataById[110] }, { id: 120, value: testDataById[120] }, { id: 121, value: testDataById[121] },
            ],
            10,
        );

        // Scroll down to bottom
        hookResult.rerender({ value: { topIndex: 8, visibleCount: 3 }, onValueChange: onValueChanged, props: {} });

        expectViewToLookLike(view, [{ isLoading: true }, { isLoading: true }], 10);

        await delay();

        expectViewToLookLike(
            view,
            [{ id: 320, value: testDataById[320] }, { id: 330, value: testDataById[330] }],
            10,
        );
    });

    it('can reload', async () => {
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => flatDataSource.useView(value, onValueChange, props),
            { initialProps: { value: currentValue, onValueChange: onValueChanged, props: {} } },
        );
        const view = hookResult.result.current;
        expectViewToLookLike(view, [
            { isLoading: true }, { isLoading: true }, { isLoading: true },
        ]);
        expect(view.getListProps().rowsCount).toBeGreaterThan(3);

        await delay();

        expectViewToLookLike(
            view,
            [
                { id: 100, value: testDataById[100], depth: 0 }, { id: 110, value: testDataById[110], depth: 0 }, { id: 120, value: testDataById[120], depth: 0 },
            ],
            10,
        );

        view.reload();

        expectViewToLookLike(view, [
            { isLoading: true }, { isLoading: true }, { isLoading: true },
        ]);

        await delay();

        expectViewToLookLike(
            view,
            [
                { id: 100, value: testDataById[100], depth: 0 }, { id: 110, value: testDataById[110], depth: 0 }, { id: 120, value: testDataById[120], depth: 0 },
            ],
            10,
        );

        // Scroll down by 1 row
        hookResult.rerender({ value: { topIndex: 1, visibleCount: 3 }, onValueChange: onValueChanged, props: {} });

        expectViewToLookLike(view, [
            { id: 110, value: testDataById[110] }, { id: 120, value: testDataById[120] }, { isLoading: true },
        ], 10);
    });

    it('handles concurrent filter updates', async () => {
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => flatDataSource.useView(value, onValueChange, props),
            { initialProps: { value: currentValue, onValueChange: onValueChanged, props: {} } },
        );
        const view = hookResult.result.current;
        view.getVisibleRows();

        // immediately set another filter and query again
        currentValue = { ...currentValue, filter: { id: { gte: 200 } } };

        hookResult.rerender({
            value: currentValue,
            onValueChange: onValueChanged,
            props: {
                getRowOptions: () => ({ checkbox: { isVisible: true } }),
            },
        });

        expectViewToLookLike(view, [
            { isLoading: true }, { isLoading: true }, { isLoading: true },
        ]);
        expect(view.getListProps().rowsCount).toBeGreaterThan(3);

        await delay();

        expectViewToLookLike(view, [
            { id: 200 }, { id: 300 }, { id: 310 },
        ], 5);

        const rows = view.getVisibleRows();
        rows[0].onCheck?.(rows[0]);
        await delay();

        hookResult.rerender({
            value: currentValue,
            onValueChange: onValueChanged,
            props: {
                getRowOptions: () => ({ checkbox: { isVisible: true } }),
            },
        });

        expectViewToLookLike(view, [
            { id: 200, isChecked: true }, { id: 300 }, { id: 310 },
        ], 5);
    });

    it('applies the filter from props', async () => {
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => flatDataSource.useView(value, onValueChange, props),
            { initialProps: { value: currentValue, onValueChange: onValueChanged, props: { filter: { id: { gte: 320 } } } } },
        );
        const view = hookResult.result.current;
        view.getListProps(); // trigger loading
        await delay();

        expectViewToLookLike(view, [{ id: 320 }, { id: 330 }], 2);
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
        const view = hookResult.result.current;

        expectViewToLookLike(view, [
            { isLoading: true }, { isLoading: true }, { isLoading: true },
        ]);
        expect(view.getListProps().rowsCount).toBeGreaterThan(3);

        await delay();

        expectViewToLookLike(view, [
            { id: 100, value: testDataById[100], depth: 0 }, { id: 110, value: testDataById[110], depth: 0 }, { id: 120, value: testDataById[120], depth: 0 },
        ]);
        expect(view.getListProps().rowsCount).toBeGreaterThan(3);

        // Scroll down by 1 row
        hookResult.rerender({ value: { topIndex: 1, visibleCount: 3 }, onValueChange: onValueChanged, props: {} });

        expectViewToLookLike(view, [
            { id: 110, value: testDataById[110] }, { id: 120, value: testDataById[120] }, { isLoading: true },
        ]);
        expect(view.getListProps().rowsCount).toBeGreaterThan(4);

        await delay();

        expectViewToLookLike(view, [
            { id: 110, value: testDataById[110] }, { id: 120, value: testDataById[120] }, { id: 121, value: testDataById[121] },
        ]);
        expect(view.getListProps().rowsCount).toBeGreaterThan(4);

        // Scroll down to bottom
        hookResult.rerender({ value: { topIndex: 8, visibleCount: 3 }, onValueChange: onValueChanged, props: {} });

        expectViewToLookLike(view, [
            { isLoading: true }, { isLoading: true }, { isLoading: true },
        ]);
        expect(view.getListProps().rowsCount).toBeGreaterThan(11);

        await delay();

        expectViewToLookLike(
            view,
            [{ id: 320, value: testDataById[320] }, { id: 330, value: testDataById[330] }],
            10,
        ); // correctly detected the end of the list
    });

    it('handles empty result', async () => {
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => flatDataSourceNoCount.useView(value, onValueChange, props),
            { initialProps: { value: { visibleCount: 3, filter: { id: -100500 } }, onValueChange: onValueChanged, props: {} } },
        );
        const view = hookResult.result.current;
        expectViewToLookLike(view, [
            { isLoading: true }, { isLoading: true }, { isLoading: true },
        ]);
        expect(view.getListProps().rowsCount).toBeGreaterThan(3);

        await delay();

        expectViewToLookLike(view, []);
        expect(view.getListProps().rowsCount).toBe(0);
    });
});
