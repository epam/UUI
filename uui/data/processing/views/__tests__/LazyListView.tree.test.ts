import { LazyDataSource } from "../../LazyDataSource";
import { LazyListView } from "../LazyListView";
import { DataSourceState, LazyDataSourceApiRequest } from "../../types";
import { runDataQuery } from '../../../querying/runDataQuery';
import { DataQueryFilter, DataRowProps, IDataSourceView } from '../../../..';

const delay = () => new Promise(resolve => setTimeout(resolve, 1));

interface TestItem {
    id: number;
    parentId?: number;
    childrenCount?: number;
}

describe('LazyListView', () => {
    const testData: TestItem[] = [
        { id: 100, }, //  0   100
        { id: 110, parentId: 100 }, //  1   110
        { id: 120, parentId: 100 }, //  2     120
        { id: 121, parentId: 120 }, //  3       121
        { id: 122, parentId: 120 }, //  4       122
        { id: 200, }, //  5   200
        { id: 300, }, //  6   300
        { id: 310, parentId: 300 }, //  7     310
        { id: 320, parentId: 300 }, //  8     320
        { id: 330, parentId: 300 }, //  9     330
    ];

    testData.forEach(i => { i.childrenCount = testData.filter(x => x.parentId == i.id).length; });

    const testDataById = (Object as any).fromEntries(testData.map(i => [i.id, i]));

    let value: DataSourceState;
    let onValueChanged = (newValue: DataSourceState) => { value = newValue; };

    const testApi = jest.fn(
        (rq: LazyDataSourceApiRequest<TestItem, number, DataQueryFilter<TestItem>>) => Promise.resolve(runDataQuery(testData, rq))
    );

    let treeDataSource = new LazyDataSource({
        api: (rq, ctx) => ctx.parent
            ? testApi({ ...rq, filter: { ...rq.filter, parentId: ctx.parentId } })
            : testApi({ ...rq, filter: { ...rq.filter, parentId: { isNull: true } } }),
        getChildCount: (i) => i.childrenCount,
    });

    beforeEach(() => {
        value = { topIndex: 0, visibleCount: 3 };
        onValueChanged = (newValue: DataSourceState) => { value = newValue; };
        testApi.mockClear();
    });

    it('testApi is ok', async () => {
        let data = await testApi({ filter: { parentId: 100 } });
        expect(data).toEqual({
            items: [
                testDataById[110],
                testDataById[120],
            ],
            count: 2
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
        ], 3);

        // Unfold some rows
        let rows = view.getVisibleRows();
        value.visibleCount = 6;
        view = ds.getView(value, onValueChanged, {});
        rows[0].onFold(rows[0]);
        view = ds.getView(value, onValueChanged, {});
        expectViewToLookLike(view, [
            { id: 100 },
            { isLoading: true },
            { isLoading: true },
            { id: 200 },
            { id: 300 },
        ], 5); // even we don't know if there are children of a children of #100, we understand that there's no row below 300, so we need to recieve exact rows count here

        await delay();

        expectViewToLookLike(view, [
            { id: 100, isFolded: false, depth: 1, isFoldable: true },
            { id: 110, depth: 2, isFoldable: false },
            { id: 120, depth: 2, isFoldable: true },
            { id: 200, depth: 1 },
            { id: 300, depth: 1 },
        ], 5);

        // Unfold more rows
        rows = view.getVisibleRows();
        rows[2].onFold(rows[2]);
        value.visibleCount = 6;
        view = ds.getView(value, onValueChanged, {});
        expectViewToLookLike(view, [
            { id: 100, isFolded: false, depth: 1, isFoldable: true },
            { id: 110, depth: 2, isFoldable: false },
            { id: 120, depth: 2, isFoldable: true },
            { isLoading: true },
            { isLoading: true },
            { id: 200, depth: 1 },
        ], 7);

        await delay();

        expectViewToLookLike(view, [
            { id: 100, isFolded: false, depth: 1, isFoldable: true },
            { id: 110, depth: 2, isFoldable: false },
            { id: 120, depth: 2, isFoldable: true },
            { id: 121, depth: 2, isFoldable: false },
            { id: 122, depth: 2, isFoldable: false },
            { id: 200, depth: 1 },
        ], 7);

        // Scroll down to bottom
        value.topIndex = 5;
        view = ds.getView(value, onValueChanged, {});

        expectViewToLookLike(view, [
            { id: 200, depth: 1 },
            { id: 300, depth: 1 },
        ], 7);
    });

    it('Multi-level folding', async () => {
        const getView = () => ds.getView(
            value,
            onValueChanged,
            {
                cascadeSelection: true,
                getRowOptions: i => ({ checkbox: { isVisible: true } }),
                isFoldedByDefault: i => false,
            });

        let ds = treeDataSource;
        value.visibleCount = 10;
        let view = getView();
        view.getListProps(); // trigger loading
        await delay();

        expectViewToLookLike(view, [
            { id: 100 },
            { id: 110 },
            { id: 120 },
            { id: 121 },
            { id: 122 },
            { id: 200 },
            { id: 300 },
            { id: 310 },
            { id: 320 },
            { id: 330 },
        ], 10);

        // fold row #120
        let rows = view.getVisibleRows();
        rows[2].onFold(rows[2]);
        view = getView();
        await delay();

        expectViewToLookLike(view, [
            { id: 100 },
            { id: 110 },
            { id: 120 },
            { id: 200 },
            { id: 300 },
            { id: 310 },
            { id: 320 },
            { id: 330 },
        ], 8);

        // fold row #100
        rows = view.getVisibleRows();
        rows[0].onFold(rows[0]);
        view = getView();
        await delay();

        expectViewToLookLike(view, [
            { id: 100 },
            { id: 200 },
            { id: 300 },
            { id: 310 },
            { id: 320 },
            { id: 330 },
        ], 6);
    });

    it('load children lazily', async () => {
        let ds = treeDataSource;
        const getView = () => ds.getView(value, onValueChanged, { isFoldedByDefault: i => false });

        let view = getView();
        view.getListProps(); // trigger loading
        await delay();

        expectViewToLookLike(view, [
            { id: 100 },
            { id: 110 },
            { id: 120 },
        ]);
        expect(view.getListProps().rowsCount).toBeGreaterThan(3);

        // Scroll down
        value.topIndex = 2;
        view = getView();

        expectViewToLookLike(view, [
            { id: 120 },
            { isLoading: true },
            { isLoading: true },
        ]);
        expect(view.getListProps().rowsCount).toBeGreaterThan(4);

        await delay();

        view = getView();

        expectViewToLookLike(view, [
            { id: 120 },
            { id: 121 },
            { id: 122 },
        ]);
    });

    it('Checkboxes works', async () => {
        const getView = () => ds.getView(
            value,
            onValueChanged,
            {
                getRowOptions: i => ({ checkbox: { isVisible: true } }),
                isFoldedByDefault: i => false,
            },
        );

        let ds = treeDataSource;
        value.visibleCount = 3;
        let view = getView();
        view.getVisibleRows();
        await delay();

        let row110 = view.getVisibleRows()[1];
        expect(row110.id).toBe(110);
        expect(row110.isChecked).toBe(false);
        row110.onCheck(row110);

        await delay();

        view = getView();
        await delay();

        expectViewToLookLike(view, [
            { id: 100, isChecked: false },
            { id: 110, isChecked: true },
            { id: 120, isChecked: false },
        ]);

        row110 = view.getVisibleRows()[1];
        row110.onCheck(row110);
        await delay();

        view = getView();
        await delay();

        expectViewToLookLike(view, [
            { id: 100, isChecked: false },
            { id: 110, isChecked: false },
            { id: 120, isChecked: false },
        ]);
    });

    it('Adjust parent checkbox if children are checked', async () => {
        let ds = treeDataSource;
        value.visibleCount = 10;
        value.checked = [121, 122, 310, 320];
        let view = ds.getView(
            value,
            onValueChanged,
            {
                cascadeSelection: true,
                getRowOptions: i => ({ checkbox: { isVisible: true } }),
                isFoldedByDefault: i => false,
            });
        view.getListProps(); // trigger loading
        await delay();

        expectViewToLookLike(view, [
            { id: 100, isChildrenChecked: true },
            { id: 110 },
            { id: 120, isChildrenChecked: true },
            { id: 121, isChecked: true },
            { id: 122, isChecked: true  },
            { id: 200 },
            { id: 300, isChildrenChecked: true },
            { id: 310, isChecked: true  },
            { id: 320, isChecked: true  },
            { id: 330 },
        ]);
    });

    it('Cascade selection works', async () => {
        const getView = () => ds.getView(
            value,
            onValueChanged,
            {
                getRowOptions: i => ({ checkbox: { isVisible: true } }),
                isFoldedByDefault: i => false,
                cascadeSelection: true,
            },
        );

        let ds = treeDataSource;
        value.visibleCount = 6;
        let view = getView();
        view.getListProps(); // trigger loading
        await delay();

        let row120 = view.getVisibleRows()[2];
        expect(row120.id).toBe(120);
        expect(row120.isChecked).toBe(false);
        row120.onCheck(row120);

        await delay();

        view = getView();
        await delay();

        expectViewToLookLike(view, [
            { id: 100, isChecked: false, isChildrenChecked: true },
            { id: 110, isChecked: false },
            { id: 120, isChecked: true, isChildrenChecked: true },
            { id: 121, isChecked: true },
            { id: 122, isChecked: true },
            { id: 200, isChecked: false },
        ]);

        row120 = view.getVisibleRows()[2];
        row120.onCheck(row120);
        await delay();

        view = getView();
        await delay();

        expectViewToLookLike(view, [
            { id: 100, isChecked: false, isChildrenChecked: false },
            { id: 110, isChecked: false },
            { id: 120, isChecked: false, isChildrenChecked: false },
            { id: 121, isChecked: false },
            { id: 122, isChecked: false },
            { id: 200, isChecked: false },
        ]);
    });

    it('Cascade selection - handles quick (simultineous) clicks', async () => {
        let ds = treeDataSource;
        let view: LazyListView<TestItem, number> = null;
        value.visibleCount = 10;

        let onValueChanged = (newValue: DataSourceState) => {
            value = newValue;
            view = getView();
        };

        function getView() {
            return ds.getView(
                value,
                onValueChanged,
                {
                    getRowOptions: i => ({ checkbox: { isVisible: true } }),
                    isFoldedByDefault: i => false,
                    cascadeSelection: true,
                },
            );
        }

        view = getView();
        view.getListProps(); // trigger loading
        await delay();

        let row120 = view.getVisibleRows()[2];
        expect(row120.id).toBe(120);
        row120.onCheck(row120);

        let row300 = view.getVisibleRows()[6];
        expect(row300.id).toBe(300);
        row300.onCheck(row300);

        await delay();

        expectViewToLookLike(view, [
            { id: 100, isChecked: false, isChildrenChecked: true },
            { id: 110, isChecked: false },
            { id: 120, isChecked: true, isChildrenChecked: true },
            { id: 121, isChecked: true },
            { id: 122, isChecked: true },
            { id: 200, isChecked: false },
            { id: 300, isChecked: true, isChildrenChecked: true },
            { id: 310, isChecked: true },
            { id: 320, isChecked: true },
            { id: 330, isChecked: true },
        ]);
    });


    it('Select All', async () => {
        const getView = () => ds.getView(
            value,
            onValueChanged,
            {
                cascadeSelection: true,
                getRowOptions: i => ({ checkbox: { isVisible: true } }),
                isFoldedByDefault: i => false,
            });

        let ds = treeDataSource;
        value.visibleCount = 2; // to check that Select All works even if not all rows are loaded
        value.checked = [121, 122, 310, 320];
        let view = getView();
        view.getListProps(); // trigger loading
        await delay();

        let selectAll = view.getListProps().selectAll;
        expect(selectAll.value).toBe(false);
        expect(selectAll.indeterminate).toBe(true);

        selectAll.onValueChange(true);
        await delay();

        value.visibleCount = 10;
        view = getView();
        await delay();

        selectAll = view.getListProps().selectAll;
        expect(selectAll.value).toBe(true);
        expect(selectAll.indeterminate).toBe(false);
        expectViewToLookLike(view, [
            { id: 100, isChecked: true, isChildrenChecked: true },
            { id: 110, isChecked: true },
            { id: 120, isChecked: true, isChildrenChecked: true },
            { id: 121, isChecked: true },
            { id: 122, isChecked: true  },
            { id: 200, isChecked: true },
            { id: 300, isChecked: true, isChildrenChecked: true },
            { id: 310, isChecked: true  },
            { id: 320, isChecked: true  },
            { id: 330, isChecked: true },
        ], 10);

        selectAll.onValueChange(false);
        await delay();

        view = getView();
        await delay();

        selectAll = view.getListProps().selectAll;
        expect(selectAll.value).toBe(false);
        expect(selectAll.indeterminate).toBe(false);
        expectViewToLookLike(view, [
            { id: 100, isChecked: false, isChildrenChecked: false },
            { id: 110, isChecked: false },
            { id: 120, isChecked: false, isChildrenChecked: false },
            { id: 121, isChecked: false },
            { id: 122, isChecked: false  },
            { id: 200, isChecked: false },
            { id: 300, isChecked: false, isChildrenChecked: false },
            { id: 310, isChecked: false  },
            { id: 320, isChecked: false  },
            { id: 330, isChecked: false },
        ], 10);
    });

    it('FocusedIndex works', async () => {
        let ds = treeDataSource;
        let view: LazyListView<TestItem, number> = null;
        value.visibleCount = 3;

        let onValueChanged = (newValue: DataSourceState) => {
            value = newValue;
            view = getView();
        };

        function getView() {
            return ds.getView(
                value,
                onValueChanged,
                {
                    getRowOptions: i => ({ checkbox: { isVisible: true } }),
                    isFoldedByDefault: i => false,
                    cascadeSelection: true,
                },
            );
        }

        view = getView();
        view.getListProps(); // trigger loading
        await delay();

        expectViewToLookLike(view, [
            { id: 100, isFocused: false },
            { id: 110, isFocused: false },
            { id: 120, isFocused: false },
        ]);

        value.focusedIndex = 0;

        view = getView();
        await delay();

        expectViewToLookLike(view, [
            { id: 100, isFocused: true },
            { id: 110, isFocused: false },
            { id: 120, isFocused: false },
        ]);

        value.focusedIndex = 2;

        view = getView();
        await delay();

        expectViewToLookLike(view, [
            { id: 100, isFocused: false },
            { id: 110, isFocused: false },
            { id: 120, isFocused: true },
        ]);
    });

    it('Correctly computes path and isLastChild', async () => {
        const getView = () => ds.getView(
            value,
            onValueChanged,
            {
                cascadeSelection: true,
                getRowOptions: i => ({ checkbox: { isVisible: true } }),
                isFoldedByDefault: i => false,
            });

        let ds = treeDataSource;
        value.visibleCount = 10;
        let view = getView();
        view.getListProps(); // trigger loading
        await delay();

        expectViewToLookLike(view, [
            { id: 100, path: [], isLastChild: false },
            { id: 110, path: [{ id: 100, isLastChild: false }], isLastChild: false },
            { id: 120, path: [{ id: 100, isLastChild: false }], isLastChild: true },
            { id: 121, path: [{ id: 100, isLastChild: false }, { id: 120, isLastChild: true }], isLastChild: false },
            { id: 122, path: [{ id: 100, isLastChild: false }, { id: 120, isLastChild: true }], isLastChild: true },
            { id: 200, path: [], isLastChild: false },
            { id: 300, path: [], isLastChild: true },
            { id: 310, path: [{ id: 300, isLastChild: true }], isLastChild: false },
            { id: 320, path: [{ id: 300, isLastChild: true }], isLastChild: false },
            { id: 330, path: [{ id: 300, isLastChild: true }], isLastChild: true },
        ], 10);
    });
});