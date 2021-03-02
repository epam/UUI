import { LazyDataSource } from "../../LazyDataSource";
import { LazyListView } from "../LazyListView";
import { DataSourceState, LazyDataSourceApiRequest } from "../../types";
import { runDataQuery } from '../../../querying/runDataQuery';
import { DataQueryFilter, DataRowProps } from '../../../..';

const delay = () => new Promise(resolve => setTimeout(resolve, 1));

interface TestParent {
    type: 'parent';
    id: number;
    childrenCount?: number;
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
        { type: 'parent', id: 1, childrenCount: 1 },
        { type: 'child' , id: 1, parentId: 1 },
        { type: 'child' , id: 2, parentId: 1 },
    ];

    let value: DataSourceState<DataQueryFilter<TestItem>, TestItemId>;
    let onValueChanged = (newValue: typeof value) => { value = newValue; };

    let treeDataSource = new LazyDataSource<TestItem, TestItemId, DataQueryFilter<TestItem>>({
        api: async ({ ids: clientIds, filter, range }, ctx) => {
            let ids = clientIds && clientIds.map(id => id[1]);
            if (ctx.parent) {
                return runDataQuery(testData, { filter: { type: 'child', parentId: ctx.parent.id} });
            } else {
                return runDataQuery(testData, { filter: { type: 'parent' }});
            }
        },
        getChildCount: (i) => i.type == 'parent' ? i.childrenCount : 0,
        getId: i => [i.type, i.id],
        cascadeSelection: true,
    });

    beforeEach(() => {
        value = { topIndex: 0, visibleCount: 3 };
    });

    function expectViewToLookLike(
        view: LazyListView<TestItem, TestItemId>,
        rows: Partial<DataRowProps<TestItem, TestItemId>>[],
        rowsCount?: number,
    ) {
        let viewRows = view.getVisibleRows();
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

        expectViewToLookLike(view, [
            { id: ['parent', 1], isFoldable: true, isFolded: true },
        ], 1);
    });

    it('can unfold nodes', async () => {
        let ds = treeDataSource;
        let view = ds.getView(value, onValueChanged, {});
        await delay();

        expectViewToLookLike(view, [
            { id: ['parent', 1], isFoldable: true, isFolded: true },
        ], 1);

        // Unfold a row
        let rows = view.getVisibleRows();
        value.visibleCount = 6;
        view = ds.getView(value, onValueChanged, {});
        rows[0].onFold(rows[0]);
        view = ds.getView(value, onValueChanged, {});
        await delay();

        expectViewToLookLike(view, [
            { id: ['parent', 1] },
            { id: ['child', 1] },
            { id: ['child', 2] },
        ], 3);
    });

    it('Checkboxes works', async () => {
        let ds = treeDataSource;
        value.visibleCount = 3;
        value.checked = [['child', 1]];

        let view = ds.getView(
            value,
            onValueChanged,
            {
                cascadeSelection: true,
                getRowOptions: _ => ({ checkbox: { isVisible: true } }),
                isFoldedByDefault: _ => false,
            }
        );

        await delay();

        expectViewToLookLike(view, [
            { id: ['parent', 1], isChildrenChecked: true, isChecked: false },
            { id: ['child', 1], isChecked: true },
            { id: ['child', 2], isChecked: false },
        ], 3);

        let row = view.getVisibleRows()[0];
        row.onCheck(row);
        await delay(); // checkboxes are async in LazyDataSource

        view.update(value, view.props);
        await delay();

        expectViewToLookLike(view, [
            { id: ['parent', 1], isChildrenChecked: true, isChecked: true },
            { id: ['child', 1], isChecked: true },
            { id: ['child', 2], isChecked: true },
        ], 3);

        row = view.getVisibleRows()[0];
        row.onCheck(row);
        await delay(); // checkboxes are async in LazyDataSource

        view.update(value, view.props);
        await delay();

        expectViewToLookLike(view, [
            { id: ['parent', 1], isChildrenChecked: false, isChecked: false },
            { id: ['child', 1], isChecked: false },
            { id: ['child', 2], isChecked: false },
        ], 3);
    });
});