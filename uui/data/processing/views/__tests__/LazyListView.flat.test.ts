import { LazyDataSource } from "../../LazyDataSource";
import { LazyListView } from "../LazyListView";
import { DataSourceState, LazyDataSourceApiRequest } from "../../types";
import { runDataQuery } from '../../../querying/runDataQuery';
import { DataQueryFilter, DataRowProps, IEditable } from '../../../..';

const delay = () => new Promise(resolve => setTimeout(resolve, 1));

interface TestItem {
    id: number;
}

describe('LazyListView - flat list test', () => {
    const testData: TestItem[] = [
        { id: 100, },
        { id: 110, },
        { id: 120, },
        { id: 121, },
        { id: 122, },
        { id: 200, },
        { id: 300, },
        { id: 310, },
        { id: 320, },
        { id: 330, },
    ];

    const testDataById = (Object as any).fromEntries(testData.map(i => [i.id, i]));

    let { value, onValueChange }: IEditable<DataSourceState<DataQueryFilter<TestItem>, number>> = {} as any;

    const testApi = (rq: LazyDataSourceApiRequest<TestItem, number, DataQueryFilter<TestItem>>) => Promise.resolve(runDataQuery(testData, rq));

    let flatDataSource = new LazyDataSource({
        api: testApi,
    });

    beforeEach(() => {
        value = { topIndex: 0, visibleCount: 3 };
        onValueChange = (newValue) => { value = newValue; };
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

    it('can scroll thru plain lists', async () => {
        let ds = flatDataSource;
        let view = ds.getView(value, onValueChange, {});
        expectViewToLookLike(view, [
            { isLoading: true },
            { isLoading: true },
            { isLoading: true },
        ]);
        expect(view.getListProps().rowsCount).toBeGreaterThan(3);

        await delay();

        expectViewToLookLike(view, [
            { id: 100, value: testDataById[100], depth: 0 },
            { id: 110, value: testDataById[110], depth: 0 },
            { id: 120, value: testDataById[120], depth: 0 },
        ], 10);

        // Scroll down by 1 row
        view = ds.getView({ topIndex: 1, visibleCount: 3 }, onValueChange, {});
        expectViewToLookLike(view, [
            { id: 110, value: testDataById[110] },
            { id: 120, value: testDataById[120] },
            { isLoading: true },
        ], 10);

        await delay();

        expectViewToLookLike(view, [
            { id: 110, value: testDataById[110] },
            { id: 120, value: testDataById[120] },
            { id: 121, value: testDataById[121] },
        ], 10);

        // Scroll down to bottom
        view = ds.getView({ topIndex: 8, visibleCount: 3 }, onValueChange, {});

        expectViewToLookLike(view, [
            { isLoading: true },
            { isLoading: true },
        ], 10);

        await delay();

        expectViewToLookLike(view, [
            { id: 320, value: testDataById[320] },
            { id: 330, value: testDataById[330] },
        ], 10);
    });

    it('can reload', async () => {
        let ds = flatDataSource;
        let view = ds.getView(value, onValueChange, {});
        expectViewToLookLike(view, [
            { isLoading: true },
            { isLoading: true },
            { isLoading: true },
        ]);
        expect(view.getListProps().rowsCount).toBeGreaterThan(3);

        await delay();

        expectViewToLookLike(view, [
            { id: 100, value: testDataById[100], depth: 0 },
            { id: 110, value: testDataById[110], depth: 0 },
            { id: 120, value: testDataById[120], depth: 0 },
        ], 10);

        view.reload();

        expectViewToLookLike(view, [
            { isLoading: true },
            { isLoading: true },
            { isLoading: true },
        ]);

        await delay();

        expectViewToLookLike(view, [
            { id: 100, value: testDataById[100], depth: 0 },
            { id: 110, value: testDataById[110], depth: 0 },
            { id: 120, value: testDataById[120], depth: 0 },
        ], 10);

        // Scroll down by 1 row
        view = ds.getView({ topIndex: 1, visibleCount: 3 }, onValueChange, {});
        expectViewToLookLike(view, [
            { id: 110, value: testDataById[110] },
            { id: 120, value: testDataById[120] },
            { isLoading: true },
        ], 10);
    });

    it('handles concurrent filter updates', async () => {
        let ds = flatDataSource;
        let view = ds.getView(value, onValueChange, {});
        value = { ...value, filter: { id: { gte: 200 } } };
        view = ds.getView(value, onValueChange, {});

        expectViewToLookLike(view, [
            { isLoading: true },
            { isLoading: true },
            { isLoading: true },
        ]);
        expect(view.getListProps().rowsCount).toBeGreaterThan(3);

        await delay();

        expectViewToLookLike(view, [
            { id: 200 },
            { id: 300 },
            { id: 310 },
        ], 5);
    });

    it('applies the filter from props', async () => {
        let ds = flatDataSource;
        let view = ds.getView(value, onValueChange, { filter: { id: { gte: 320 } } });
        view.getListProps(); // trigger loading
        await delay();

        expectViewToLookLike(view, [
            { id: 320 },
            { id: 330 },
        ], 2);
    });

    const testApiNoCount = (rq: LazyDataSourceApiRequest<TestItem, number, DataQueryFilter<TestItem>>) =>
        Promise.resolve({ ...runDataQuery(testData, rq), count: null });

    let flatDataSourceNoCount = new LazyDataSource({
        api: testApiNoCount,
    });

    it('can scroll thru plain lists (no count returned from API)', async () => {
        let ds = flatDataSourceNoCount;
        let view = ds.getView(value, onValueChange, {});
        expectViewToLookLike(view, [
            { isLoading: true },
            { isLoading: true },
            { isLoading: true },
        ]);
        expect(view.getListProps().rowsCount).toBeGreaterThan(3);

        await delay();

        expectViewToLookLike(view, [
            { id: 100, value: testDataById[100], depth: 0 },
            { id: 110, value: testDataById[110], depth: 0 },
            { id: 120, value: testDataById[120], depth: 0 },
        ]);
        expect(view.getListProps().rowsCount).toBeGreaterThan(3);

        // Scroll down by 1 row
        view = ds.getView({ topIndex: 1, visibleCount: 3 }, onValueChange, {});
        expectViewToLookLike(view, [
            { id: 110, value: testDataById[110] },
            { id: 120, value: testDataById[120] },
            { isLoading: true },
        ]);
        expect(view.getListProps().rowsCount).toBeGreaterThan(4);

        await delay();

        expectViewToLookLike(view, [
            { id: 110, value: testDataById[110] },
            { id: 120, value: testDataById[120] },
            { id: 121, value: testDataById[121] },
        ]);
        expect(view.getListProps().rowsCount).toBeGreaterThan(4);

        // Scroll down to bottom
        view = ds.getView({ topIndex: 8, visibleCount: 3 }, onValueChange, {});

        expectViewToLookLike(view, [
            { isLoading: true },
            { isLoading: true },
            { isLoading: true },
        ]);
        expect(view.getListProps().rowsCount).toBeGreaterThan(11);

        await delay();

        expectViewToLookLike(view, [
            { id: 320, value: testDataById[320] },
            { id: 330, value: testDataById[330] },
        ], 10); // correctly detected the end of the list
    });

    it('handles empty result', async () => {
        let ds = flatDataSourceNoCount;
        let view = ds.getView({ visibleCount: 3, filter: { id: -100500 }}, onValueChange, {});
        expectViewToLookLike(view, [
            { isLoading: true },
            { isLoading: true },
            { isLoading: true },
        ]);
        expect(view.getListProps().rowsCount).toBeGreaterThan(3);

        await delay();

        expectViewToLookLike(view, []);
        expect(view.getListProps().rowsCount).toBe(0);
    });
});