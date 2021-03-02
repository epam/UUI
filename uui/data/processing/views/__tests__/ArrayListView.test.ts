import { ArrayListView, ArrayListViewProps } from '../ArrayListView';
import { ArrayDataSource } from '../../ArrayDataSource';
import { DataSourceState } from "../../types";

interface TItem {
    id: number;
    level: string;
    parentId?: number;
}

const testItems: TItem[] = [
    { "id": 2, "level": "A1" },
    { "id": 5, "level": "A2+" },
    { "id": 1, "level": "A0" },
    { "id": 3, "level": "A1+" },
    { "id": 4, "level": "A2" },
    { "id": 6, "level": "B" },
    { "id": 7, "level": "B1+", parentId: 6 },
    { "id": 8, "level": "B2", parentId: 6 },
    { "id": 9, "level": "B2+", parentId: 6 },
    { "id": 10, "level": "C1" },
    { "id": 11, "level": "C1+" },
    { "id": 12, "level": "C2" },
];

const totalRowsCount = 12;
const rootNodesCount = 9;

let dataSource: ArrayDataSource<{ id: number, level: string }, number, any> = null;
let view: ArrayListView<any, any> = null;

let onValueChange: () => any = null;
let initialValue: DataSourceState = { topIndex: 0, visibleCount: totalRowsCount };
let viewProps: ArrayListViewProps<TItem, number, any>;


describe('ArrayListView', () => {
    beforeEach(() => {
        onValueChange = jest.fn();

        dataSource = new ArrayDataSource<TItem, number>({ items: testItems });
        viewProps = {
            getId: i => i.id,
            getSearchFields: (item) => [item.level],
            getRowOptions: (item, index) => ({
                checkbox: {
                    isVisible: true,
                },
                isSelectable: true,
            }),
        };
        view = new ArrayListView(dataSource, { value: initialValue, onValueChange }, viewProps);
    });

    it('should create visibleRows on constructor', () => {
        expect(view.visibleRows).toHaveLength(rootNodesCount);
    });

    describe('setValue logic', () => {
        it('should set new value and update rows', () => {
            const updateNodesSpy = jest.spyOn(view, 'updateNodes' as any);

            view.update({ filter: {} }, viewProps);

            expect(view.value).toStrictEqual({ filter: {} });
            expect(updateNodesSpy).toHaveBeenCalled();
        });

        it('should not update nodes when setValue called with the same value', () => {
            const updateNodesSpy = jest.spyOn(view, 'updateNodes' as any);

            view.update(initialValue, viewProps);

            expect(updateNodesSpy).toHaveBeenCalledTimes(0);
        });

        it('should update focused item if only focusedIndex changed in value', () => {
            const updateFocusedItemSpy = jest.spyOn(view, 'updateFocusedItem' as any);

            view.update({ ...initialValue, focusedIndex: 1 }, viewProps);

            expect(updateFocusedItemSpy).toHaveBeenCalledTimes(1);
        });
    });

    it('should return item by ID', () => {
        const row = view.getById(testItems[1].id, 1);
        expect(row).toHaveProperty('id', testItems[1].id);
        expect(row).toHaveProperty('value', testItems[1]);
        expect(row).toHaveProperty('index', 1);
    });

    it('should return rows', () => {
        view.update({ ...initialValue, topIndex: 2, visibleCount: 15 }, viewProps);
        expect(view.getVisibleRows()).toHaveLength(rootNodesCount - 2);
    });

    it('should return all nodes, if isFoldedByDefault is true', () => {
        view = new ArrayListView<TItem, number>(
            dataSource,
            { value: initialValue, onValueChange },
            {
                getId: i => i.id,
                isFoldedByDefault: () => false,
            },
        );

        expect(view.visibleRows).toHaveLength(totalRowsCount);
    });

    describe('sorting', () => {
        it('should return rows in default order, if sorting do not passed', () => {
            view.update({ ...initialValue, topIndex: 0, visibleCount: 20 }, viewProps);
            const rows = view.getVisibleRows();
            expect(rows[0].id).toEqual(2);
            expect(rows[4].id).toEqual(4);
        });

        it('should sort rows if set sorting to value', () => {
            view.update({ ...initialValue, sorting: [{ field: 'id', direction: 'asc' }], topIndex: 0, visibleCount: 20 }, viewProps);
            const rows = view.getVisibleRows();
            expect(rows[0].id).toEqual(1);
            expect(rows[4].id).toEqual(5);
        });
    });

    describe('search', () => {
        it('should search items', () => {
            view.update({ ...initialValue, search: 'C1', topIndex: 0, visibleCount: 20 }, viewProps);
            const rows = view.getVisibleRows();
            const rowsIds = rows.map(i => i.id);

            expect(rows).toHaveLength(2);
            expect(rowsIds).toEqual([10, 11]);
        });
    });

    describe('row handlers', () => {
        // it('onCheck handler shout set id to checked array in value', async () => {
        //     const row1 = view.getById(6, 6);
        //     row1.onCheck(row1);
        //     expect(onValueChange).toHaveBeenCalledWith({ ...initialValue, checked: [6] });
        //
        //     view._setValue({...initialValue, checked: [6]});
        //
        //     const row2 = view.getById(7, 7);
        //     row2.onCheck(row2);
        //     expect(onValueChange).toHaveBeenCalledWith({ ...initialValue, checked: [6, 7] });
        // });

        it('should check all children when parent checked with cascadeSelection true', () => {
            view = new ArrayListView<TItem, number>(
                dataSource,
                { value: initialValue, onValueChange },
                {
                    getId: i => i.id,
                    cascadeSelection: true,
                    getRowOptions: () => ({
                        checkbox: { isVisible: true },
                    }),
                },
            );

            const row1 = view.getById(6, 6);
            row1.onCheck(row1);

            expect(onValueChange).toBeCalledWith({ ...initialValue, checked: [6, 7, 8, 9] });
        });
    });

    it('should select item in single mode', () => {
        const row = view.getById(6, 6);
        row.onSelect(row);

        expect(onValueChange).toBeCalledWith({ ...initialValue, selectedId: 6 });
    });

    it('should set focusedItem', () => {
        const row = view.getById(6, 6);
        row.onFocus(row.index);

        expect(onValueChange).toBeCalledWith({ ...initialValue, focusedIndex: row.index });
    });

    it('should fold/unfold item', () => {
        const row = view.getVisibleRows()[5];
        row.onFold(row);

        expect(onValueChange).toBeCalledWith({ ...initialValue, folded: { [row.id]: !row.isFolded } });
    });
});