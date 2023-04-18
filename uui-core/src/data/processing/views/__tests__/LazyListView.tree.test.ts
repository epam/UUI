import { LazyDataSource } from "../../LazyDataSource";
import { LazyListView } from "../LazyListView";
import { delay } from "@epam/test-utils";
import { DataSourceState, LazyDataSourceApiRequest, DataQueryFilter, DataRowProps } from "../../../../types";
import { runDataQuery } from '../../../querying/runDataQuery';

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

    testData.forEach(i => { i.childrenCount = testData.filter(x => x.parentId == i.id).length; });

    const testDataById = (Object as any).fromEntries(testData.map(i => [i.id, i]));

    let value: DataSourceState;
    let onValueChanged = (newValue: DataSourceState) => { value = newValue; };

    const testApi = jest.fn(
        (rq: LazyDataSourceApiRequest<TestItem, number, DataQueryFilter<TestItem>>) => Promise.resolve(runDataQuery(testData, rq)),
    );

    let treeDataSource = new LazyDataSource({
        api: (rq, ctx) => ctx?.parent
            ? testApi({ ...rq, filter: { ...rq.filter, parentId: ctx.parentId } })
            : testApi({ ...rq, filter: { ...rq.filter, parentId: { isNull: true } } }),
        getChildCount: (i) => i.childrenCount,
        getParentId: i => i.parentId,
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
            count: 2,
        });
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
            { isLoading: true, depth: 0, indent: 0, path: [] },
            { isLoading: true, depth: 0, indent: 0, path: [] },
            { isLoading: true, depth: 0, indent: 0, path: [] },
        ]);
        expect(view.getListProps().rowsCount).toBeGreaterThan(3);

        await delay();
        expect(testApi).toBeCalledTimes(1);
        testApi.mockClear();

        expectViewToLookLike(view, [
            { id: 100, isFoldable: true, isFolded: true, path: [] },
            { id: 200, isFoldable: false, path: [] },
            { id: 300, isFoldable: true, isFolded: true, path: [] },
        ], 3);

        // Unfold some rows
        let rows = view.getVisibleRows();
        value.visibleCount = 6;
        view = ds.getView(value, onValueChanged, {});
        rows[0].onFold(rows[0]);
        view = ds.getView(value, onValueChanged, {});
        expectViewToLookLike(view, [
            { id: 100, depth: 0, indent: 1 },
            { isLoading: true, depth: 1, indent: 2 },
            { isLoading: true, depth: 1, indent: 2 },
            { id: 200, depth: 0, indent: 1 },
            { id: 300, depth: 0, indent: 1 },
        ], 5); // even we don't know if there are children of a children of #100, we understand that there's no row below 300, so we need to receive exact rows count here

        await delay();

        expectViewToLookLike(view, [
            { id: 100, isFolded: false, depth: 0, indent: 1, isFoldable: true },
            { id: 110, depth: 1, indent: 2, isFoldable: false },
            { id: 120, depth: 1, indent: 2, isFoldable: true },
            { id: 200, depth: 0, indent: 1 },
            { id: 300, depth: 0, indent: 1 },
        ], 5);

        // Unfold more rows
        rows = view.getVisibleRows();
        rows[2].onFold(rows[2]);
        value.visibleCount = 6;
        view = ds.getView(value, onValueChanged, {});
        expectViewToLookLike(view, [
            { id: 100, isFolded: false, depth: 0, indent: 1, isFoldable: true },
            { id: 110, depth: 1, indent: 2, isFoldable: false },
            { id: 120, depth: 1, indent: 2, isFoldable: true },
            { isLoading: true, depth: 2, indent: 3 },
            { isLoading: true, depth: 2, indent: 3 },
            { id: 200, depth: 0, indent: 1 },
        ]);

        await delay();

        expectViewToLookLike(view, [
            { id: 100, isFolded: false, depth: 0, indent: 1, isFoldable: true },
            { id: 110, depth: 1, indent: 2, isFoldable: false },
            { id: 120, depth: 1, indent: 2, isFoldable: true },
            { id: 121, depth: 2, indent: 3, isFoldable: false },
            { id: 122, depth: 2, indent: 3, isFoldable: false },
            { id: 200, depth: 0, indent: 1 },
        ]);

        // Scroll down to bottom
        value.topIndex = 5;
        view = ds.getView(value, onValueChanged, {});

        expectViewToLookLike(view, [
            { id: 200, depth: 0, indent: 1 },
            { id: 300, depth: 0, indent: 1 },
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

    it('should not update checkboxes if onValueChange is not updating them', async () => {
        const mockOnValueChanged = jest.fn();
        const getView = () => ds.getView(
            value,
            mockOnValueChanged,
            {
                getRowOptions: i => ({ checkbox: { isVisible: true } }),
                isFoldedByDefault: i => false,
            },
        );

        let ds = treeDataSource;
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

        expect(mockOnValueChanged).toBeCalledWith({ checked: [row110.id], topIndex: 0, visibleCount: 3 })

        expectViewToLookLike(view, [
            { id: 100, isChecked: false },
            { id: 110, isChecked: false },
            { id: 120, isChecked: false },
        ]);

        view.update({ ...value, checked: [row110.id] }, view.props);

        expect(mockOnValueChanged).toBeCalledWith({ checked: [row110.id], topIndex: 0, visibleCount: 3 })

        expectViewToLookLike(view, [
            { id: 100, isChecked: false },
            { id: 110, isChecked: true },
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
            { id: 122, isChecked: true },
            { id: 200 },
            { id: 300, isChildrenChecked: true },
            { id: 310, isChecked: true },
            { id: 320, isChecked: true },
            { id: 330 },
        ]);
    });

    describe('CascadeSelection - explicit mode', () => {
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

        it('Cascade selection - handles quick (simultaneous) clicks', async () => {
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

            await delay();

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
                { id: 122, isChecked: true },
                { id: 200, isChecked: true },
                { id: 300, isChecked: true, isChildrenChecked: true },
                { id: 310, isChecked: true },
                { id: 320, isChecked: true },
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
                { id: 122, isChecked: false },
                { id: 200, isChecked: false },
                { id: 300, isChecked: false, isChildrenChecked: false },
                { id: 310, isChecked: false },
                { id: 320, isChecked: false },
                { id: 330, isChecked: false },
            ], 10);
        });
    });


    describe('CascadeSelection - implicit mode', () => {
        it('Cascade selection works', async () => {
            const getView = () => ds.getView(
                value,
                onValueChanged,
                {
                    getRowOptions: i => ({ checkbox: { isVisible: true } }),
                    isFoldedByDefault: i => false,
                    cascadeSelection: 'implicit',
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

            expect(value.checked).toEqual([120]);

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

            expect(value.checked).toEqual([]);
        });

        it('Cascade selection - handles quick (simultaneous) clicks', async () => {
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
                        cascadeSelection: 'implicit',
                    },
                );
            }

            view = getView();
            view.getListProps(); // trigger loading
            await delay();

            let row120 = view.getVisibleRows()[2];
            expect(row120.id).toBe(120);
            row120.onCheck(row120);

            await delay();

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

            expect(value.checked).toEqual([120, 300])
        });

        it('Select All', async () => {
            const getView = () => ds.getView(
                value,
                onValueChanged,
                {
                    cascadeSelection: 'implicit',
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
            await delay();

            expectViewToLookLike(view, [
                { id: 100, isChecked: true, isChildrenChecked: true },
                { id: 110, isChecked: true },
                { id: 120, isChecked: true, isChildrenChecked: true },
                { id: 121, isChecked: true },
                { id: 122, isChecked: true },
                { id: 200, isChecked: true },
                { id: 300, isChecked: true, isChildrenChecked: true },
                { id: 310, isChecked: true },
                { id: 320, isChecked: true },
                { id: 330, isChecked: true },
            ], 10);

            expect(value.checked).toEqual([100, 200, 300]);
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
                { id: 122, isChecked: false },
                { id: 200, isChecked: false },
                { id: 300, isChecked: false, isChildrenChecked: false },
                { id: 310, isChecked: false },
                { id: 320, isChecked: false },
                { id: 330, isChecked: false },
            ], 10);
        });
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
        value.folded = { '120': true };
        value.visibleCount = 10;
        let view = getView();
        view.getListProps(); // trigger loading

        await delay();

        value.folded = { '120': false };
        view = getView();
        view.getListProps(); // trigger loading

        expectViewToLookLike(view, [
            { id: 100, path: [], isLastChild: false },
            { id: 110, path: [{ id: 100, isLastChild: false, value: testDataById[100] }], isLastChild: false },
            { id: 120, path: [{ id: 100, isLastChild: false, value: testDataById[100] }], isLastChild: true },
            {
                isLoading: true,
                path: [{ id: 100, isLastChild: false, value: testDataById[100] }, { id: 120, isLastChild: true, value: testDataById[120] }],
                isLastChild: false,
            },
            {
                isLoading: true,
                path: [{ id: 100, isLastChild: false, value: testDataById[100] }, { id: 120, isLastChild: true, value: testDataById[120] }],
                isLastChild: true,
            },
            { id: 200, path: [], isLastChild: false },
            { id: 300, path: [], isLastChild: true },
            { id: 310, path: [{ id: 300, isLastChild: true, value: testDataById[300] }], isLastChild: false },
            { id: 320, path: [{ id: 300, isLastChild: true, value: testDataById[300] }], isLastChild: false },
            { id: 330, path: [{ id: 300, isLastChild: true, value: testDataById[300] }], isLastChild: true },
        ], 10);

        await delay();

        expectViewToLookLike(view, [
            { id: 100, path: [], isLastChild: false },
            { id: 110, path: [{ id: 100, isLastChild: false, value: testDataById[100] }], isLastChild: false },
            { id: 120, path: [{ id: 100, isLastChild: false, value: testDataById[100] }], isLastChild: true },
            {
                id: 121,
                path: [{ id: 100, isLastChild: false, value: testDataById[100] }, { id: 120, isLastChild: true, value: testDataById[120] }],
                isLastChild: false,
            },
            { id: 122, path: [{ id: 100, isLastChild: false, value: testDataById[100] }, { id: 120, isLastChild: true, value: testDataById[120] }], isLastChild: true },
            { id: 200, path: [], isLastChild: false },
            { id: 300, path: [], isLastChild: true },
            { id: 310, path: [{ id: 300, isLastChild: true, value: testDataById[300] }], isLastChild: false },
            { id: 320, path: [{ id: 300, isLastChild: true, value: testDataById[300] }], isLastChild: false },
            { id: 330, path: [{ id: 300, isLastChild: true, value: testDataById[300] }], isLastChild: true },
        ], 10);
    });


    it('Correctly fold inner children in hierarchy', async () => {
        const testData: TestItem[] = [
            { id: 100 },
            { id: 110, parentId: 100 }, // we add a lot of row here, to prevent loading some rows on initial load
            { id: 111, parentId: 110 },
            { id: 112, parentId: 110 },
            { id: 113, parentId: 110 },
            { id: 114, parentId: 110 },
            { id: 115, parentId: 110 },
            { id: 116, parentId: 110 },
            { id: 120, parentId: 100 },
            { id: 121, parentId: 120 }, // these children won't be loaded.
            { id: 122, parentId: 120 }, // there was bug that non-loaded children was still produce loading rows
            { id: 123, parentId: 120 }, // as there were missing check that parent is folded
            { id: 124, parentId: 120 },
            { id: 125, parentId: 120 },
            { id: 200 },
            { id: 300 },
            { id: 400 },
            { id: 500 },
            { id: 600 },
            { id: 700 },
            { id: 800 },
            { id: 900 },
        ];

        testData.forEach(i => { i.childrenCount = testData.filter(x => x.parentId == i.id).length; });

        let value: DataSourceState = { visibleCount: 5 };
        let onValueChanged = (newValue: DataSourceState) => { value = newValue; };

        const testApi = jest.fn(
            (rq: LazyDataSourceApiRequest<TestItem, number, DataQueryFilter<TestItem>>) => Promise.resolve(runDataQuery(testData, rq)),
        );

        let ds = new LazyDataSource({
            api: (rq, ctx) => ctx.parent
                ? testApi({ ...rq, filter: { ...rq.filter, parentId: ctx.parentId } })
                : testApi({ ...rq, filter: { ...rq.filter, parentId: { isNull: true } } }),
            getChildCount: (i) => i.childrenCount,
        });

        const getView = () => ds.getView(
            value,
            onValueChanged,
            {
                cascadeSelection: true,
                getRowOptions: i => ({ checkbox: { isVisible: true } }),
                isFoldedByDefault: i => false,
                getParentId: i => i.parentId,
            });

        let view = getView();
        view.getListProps(); // trigger loading
        await delay();

        // fold row #100
        let rows = view.getVisibleRows();
        rows[0].onFold(rows[0]);
        view = getView();
        rows = view.getVisibleRows();

        expect(rows).toEqual([
            { id: 100 },
            { id: 200 },
            { id: 300 },
            { id: 400 },
            { id: 500 },
        ].map(r => expect.objectContaining(r)));

        await delay();

        rows = view.getVisibleRows();
        view = getView();

        expect(rows).toEqual([
            { id: 100 },
            { id: 200 },
            { id: 300 },
            { id: 400 },
            { id: 500 },
        ].map(r => expect.objectContaining(r)));
    });

    it('should check/uncheck parents if all/no siblings checked', async () => {
        let ds = treeDataSource;
        value.visibleCount = 10;
        let view: LazyListView<TestItem, number> = null;

        let onValueChanged = (newValue: DataSourceState) => {
            value = newValue;
            view = getView();
        };

        const getView = () => ds.getView(
            value,
            onValueChanged,
            {
                getRowOptions: i => ({ checkbox: { isVisible: true } }),
                isFoldedByDefault: i => false,
                cascadeSelection: true,
            },
        );

        view = getView();
        view.getVisibleRows();
        await delay();

        let row121 = view.getVisibleRows()[3];
        row121.onCheck(row121);
        await delay();

        let row122 = view.getVisibleRows()[4];
        row122.onCheck(row122);
        await delay();

        expectViewToLookLike(view, [
            { id: 100, isChildrenChecked: true },
            { id: 110 },
            { id: 120, isChecked: true, isChildrenChecked: true },
            { id: 121, isChecked: true },
            { id: 122, isChecked: true },
            { id: 200 },
            { id: 300, isChildrenChecked: false },
            { id: 310, isChecked: false },
            { id: 320, isChecked: false },
            { id: 330 },
        ]);

        row121 = view.getVisibleRows()[3];
        row121.onCheck(row121);
        await delay();

        expectViewToLookLike(view, [
            { id: 100, isChildrenChecked: true },
            { id: 110 },
            { id: 120, isChecked: false, isChildrenChecked: true },
            { id: 121, isChecked: false },
            { id: 122, isChecked: true },
            { id: 200 },
            { id: 300, isChildrenChecked: false },
            { id: 310, isChecked: false },
            { id: 320, isChecked: false },
            { id: 330 },
        ]);
    });

    it('should return selected rows in selection order', async () => {
        let ds = treeDataSource;
        let view = ds.getView({ ...value, checked: [320, 310, 121, 122] }, onValueChanged, {});
        view.getListProps(); // trigger loading
        await delay();

        const selectedRows = view.getSelectedRows(0);
        expect(selectedRows.map(({ id }) => id)).toEqual([320, 310, 121, 122]);
    });
});