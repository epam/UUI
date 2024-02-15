import { LazyDataSource } from '../../LazyDataSource';
import { LazyListView, LazyListViewProps } from '../LazyListView';
import { runDataQuery } from '../../../querying/runDataQuery';
import { delay, renderHook } from '@epam/uui-test-utils';
import { DataQueryFilter, DataRowProps, DataSourceState } from '../../../../types';

interface TestParent {
    type: 'parent';
    id: number;
    childrenCount?: number;
    parentId?: number;
}

interface TestChild {
    type: 'child';
    id: number;
    parentId?: number;
}

type TestItem = TestParent | TestChild;
type TestItemId = [TestItem['type'], number];

describe('LazyListView - can work with id like [string, number]', () => {
    const testData: TestItem[] = [
        { type: 'parent', id: 1, childrenCount: 1 }, { type: 'child', id: 1, parentId: 1 }, { type: 'child', id: 2, parentId: 1 },
    ];

    let currentValue: DataSourceState<DataQueryFilter<TestItem>, TestItemId>;
    const onValueChanged = (newValue: typeof currentValue) => {
        currentValue = newValue;
    };

    const treeDataSource = new LazyDataSource<TestItem, TestItemId, DataQueryFilter<TestItem>>({
        api: async (_, ctx) => {
            if (ctx?.parent) {
                return runDataQuery(testData, { filter: { type: 'child', parentId: ctx.parent.id } });
            } else {
                return runDataQuery(testData, { filter: { type: 'parent' } });
            }
        },
        getChildCount: (i) => (i.type === 'parent' ? i.childrenCount ?? 0 : 0),
        getId: (i) => [i.type, i.id],
        getParentId: (i) => (i.parentId ? ['parent', i.parentId] : undefined),
        cascadeSelection: true,
        complexIds: true,
    });

    beforeEach(() => {
        currentValue = { topIndex: 0, visibleCount: 3 };
    });

    function expectViewToLookLike(view: LazyListView<TestItem, TestItemId>, rows: Partial<DataRowProps<TestItem, TestItemId>>[], rowsCount?: number) {
        const viewRows = view.getVisibleRows();
        expect(viewRows).toEqual(rows.map((r) => expect.objectContaining(r)));
        const listProps = view.getListProps();
        rowsCount != null && expect(listProps.rowsCount).toEqual(rowsCount);
    }

    it('can load tree, unfold nodes, and scroll down', async () => {
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => treeDataSource.useView(value, onValueChange, props),
            { initialProps: { value: currentValue, onValueChange: onValueChanged, props: {} } },
        );

        const view = hookResult.result.current;

        expectViewToLookLike(view, [
            { isLoading: true }, { isLoading: true }, { isLoading: true },
        ]);
        expect(view.getListProps().rowsCount).toBeGreaterThan(3);

        await delay();

        expectViewToLookLike(view, [{ id: ['parent', 1], isFoldable: true, isFolded: true }], 1);
    });

    it('can unfold nodes', async () => {
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => treeDataSource.useView(value, onValueChange, props),
            { initialProps: { value: currentValue, onValueChange: onValueChanged, props: {} } },
        );

        const view = hookResult.result.current;
        expect(view.getListProps().rowsCount).toBeGreaterThan(3);

        await delay();

        expectViewToLookLike(view, [{ id: ['parent', 1], isFoldable: true, isFolded: true }], 1);

        // Unfold a row
        let rows = view.getVisibleRows();
        rows[0].onFold?.(rows[0]);

        hookResult.rerender({ value: { ...currentValue, visibleCount: 6 }, onValueChange: onValueChanged, props: {} });

        rows = view.getVisibleRows();

        await delay();

        expectViewToLookLike(view, [
            { id: ['parent', 1] }, { id: ['child', 1] }, { id: ['child', 2] },
        ], 3);
    });

    it('Checkboxes works', async () => {
        currentValue = { ...currentValue, visibleCount: 3, checked: [['child', 1]] as TestItemId[] };
        const viewProps: Partial<LazyListViewProps<TestItem, TestItemId, DataQueryFilter<TestItem>>> = {
            cascadeSelection: true,
            getRowOptions: () => ({ checkbox: { isVisible: true } }),
            isFoldedByDefault: () => false,
        };

        const hookResult = renderHook(
            ({ value, onValueChange, props }) => treeDataSource.useView(value, onValueChange, props),
            { initialProps: {
                value: currentValue,
                onValueChange: onValueChanged,
                props: viewProps,
            } },
        );

        const view = hookResult.result.current;
        view.getVisibleRows(); // load;
        await delay();

        expectViewToLookLike(
            view,
            [
                { id: ['parent', 1], isChildrenChecked: true, isChecked: false }, { id: ['child', 1], isChecked: true }, { id: ['child', 2], isChecked: false },
            ],
            3,
        );

        let row = view.getVisibleRows()[2]; // -> all children checked = parent checked
        row.onCheck?.(row);
        await delay(); // checkboxes are async in LazyDataSource

        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: viewProps });

        await delay();

        expectViewToLookLike(
            view,
            [
                { id: ['parent', 1], isChildrenChecked: true, isChecked: true }, { id: ['child', 1], isChecked: true }, { id: ['child', 2], isChecked: true },
            ],
            3,
        );

        row = view.getVisibleRows()[0];
        row.onCheck?.(row);
        await delay(); // checkboxes are async in LazyDataSource

        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: viewProps });

        await delay();

        expectViewToLookLike(
            view,
            [
                { id: ['parent', 1], isChildrenChecked: false, isChecked: false }, { id: ['child', 1], isChecked: false }, { id: ['child', 2], isChecked: false },
            ],
            3,
        );
    });

    // ListApiCache can't work with complex ids.
    // However, it looks we
    it.skip('should receive item by id', async () => {
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => treeDataSource.useView(value, onValueChange, props),
            { initialProps: {
                value: currentValue,
                onValueChange: onValueChanged,
                props: {},
            } },
        );
        const view = hookResult.result.current;
        view.getVisibleRows();

        await delay();

        const firstRow = view.getVisibleRows()[0];

        const item = view.getById(firstRow.id, 0);

        expect(item.value).toEqual(firstRow.value);
    });
});
