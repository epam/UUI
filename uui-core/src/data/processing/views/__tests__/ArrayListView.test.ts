import { renderHook } from '@epam/uui-test-utils';
import { ArrayListViewProps } from '../ArrayListView';
import { ArrayDataSource } from '../../ArrayDataSource';
import { CascadeSelection, DataSourceState, SortDirection } from '../../../../types';
import isEqual from 'lodash.isequal';

interface TItem {
    id: number;
    level: string;
    parentId?: number;
}

const testItems: TItem[] = [
    { id: 2, level: 'A1' },
    { id: 5, level: 'A2+' },
    { id: 1, level: 'A0' },
    { id: 3, level: 'A1+' },
    { id: 4, level: 'A2' },
    { id: 6, level: 'B' },
    { id: 7, level: 'B1+', parentId: 6 },
    { id: 8, level: 'B2', parentId: 6 },
    { id: 9, level: 'B2+', parentId: 6 },
    { id: 10, level: 'C1' },
    { id: 11, level: 'C1+' },
    { id: 12, level: 'C2' },
];

interface Country {
    id: string;
    name: string;
}

const countries: Country[] = [
    { id: 'CN', name: 'China' },
    { id: 'ES', name: 'Spain' },
    { id: 'FI', name: 'Finland' },
    { id: 'GB', name: 'United Kingdom' },
    { id: 'NC', name: 'Nicaragua' },
    { id: 'GN', name: 'Guinea' },
    { id: 'GW', name: 'Guinea-Bissau' },
];

const totalRowsCount = 12;
const rootNodesCount = 9;

let dataSource: ArrayDataSource<{ id: number; level: string }, number, any>;

let onValueChangeFn: (newValue: DataSourceState<any, number>) => any;
const initialValue: DataSourceState = { topIndex: 0, visibleCount: totalRowsCount };
let viewProps: ArrayListViewProps<TItem, number, any>;

describe('ArrayListView', () => {
    beforeEach(() => {
        onValueChangeFn = jest.fn();

        dataSource = new ArrayDataSource<TItem, number>({
            items: testItems,
            getId: (i) => i.id,
            getParentId: (i) => i.parentId,
        });

        viewProps = {
            getId: (i) => i.id,
            getSearchFields: (item) => [item.level],
            getRowOptions: () => ({
                checkbox: {
                    isVisible: true,
                },
                isSelectable: true,
            }),
        };

        jest.clearAllMocks();
    });

    it('should create visibleRows on constructor', () => {
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
            { initialProps: { value: initialValue, onValueChange: onValueChangeFn, props: viewProps } },
        );
        const rows = hookResult.result.current.getVisibleRows();
        expect(rows).toHaveLength(rootNodesCount);
    });

    describe('setValue logic', () => {
        it('should set new value and update rows', () => {
            const hookResult = renderHook(
                ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                { initialProps: { value: initialValue, onValueChange: onValueChangeFn, props: viewProps } },
            );

            let view = hookResult.result.current;

            const rows = view.getVisibleRows();

            hookResult.rerender({ value: { filter: {} }, onValueChange: onValueChangeFn, props: viewProps });
            view = hookResult.result.current;

            const newRows = view.getVisibleRows();
            expect(isEqual(rows, newRows)).toBeFalsy();
        });

        it('should not update nodes when setValue called with the same value', () => {
            const hookResult = renderHook(
                ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                { initialProps: { value: initialValue, onValueChange: onValueChangeFn, props: viewProps } },
            );

            const view = hookResult.result.current;
            const rows = view.getVisibleRows();

            hookResult.rerender({ value: initialValue, onValueChange: onValueChangeFn, props: viewProps });
            const newRows = view.getVisibleRows();
            expect(isEqual(rows, newRows)).toBeTruthy();
        });

        it('should update focused item if only focusedIndex changed in value', () => {
            const hookResult = renderHook(
                ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                { initialProps: { value: initialValue, onValueChange: onValueChangeFn, props: viewProps } },
            );

            const view = hookResult.result.current;

            hookResult.rerender({ value: { ...initialValue, focusedIndex: 1 }, onValueChange: onValueChangeFn, props: viewProps });

            const rows = view.getVisibleRows();
            const focusedRows = rows.filter((row) => row.isFocused);
            expect(focusedRows).toHaveLength(1);
            expect(focusedRows[0].index).toBe(1);
        });
    });

    it('should return item by ID', () => {
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
            { initialProps: { value: initialValue, onValueChange: onValueChangeFn, props: viewProps } },
        );

        const view = hookResult.result.current;
        const row = view.getById(testItems[1].id, 1);
        expect(row).toHaveProperty('id', testItems[1].id);
        expect(row).toHaveProperty('value', testItems[1]);
        expect(row).toHaveProperty('index', 1);
    });

    it('should return rows', () => {
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
            { initialProps: { value: initialValue, onValueChange: onValueChangeFn, props: viewProps } },
        );

        let view = hookResult.result.current;

        const topIndex = 2;
        hookResult.rerender({ value: { ...initialValue, topIndex, visibleCount: 15 }, onValueChange: onValueChangeFn, props: viewProps });

        view = hookResult.result.current;
        const rows = view.getVisibleRows();
        const rootTestItems = testItems.filter((i) => i.parentId == null).slice(topIndex);
        expect(rows).toMatchObject(rootTestItems.map((i) => ({ id: i.id, value: i })));
        expect(view.getVisibleRows()).toHaveLength(rootTestItems.length);
    });

    it('should return all nodes, if isFoldedByDefault is false', () => {
        const newViewProps: ArrayListViewProps<TItem, number, any> = {
            getId: (i) => i.id,
            isFoldedByDefault: () => false,
        };

        const hookResult = renderHook(
            ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
            { initialProps: { value: initialValue, onValueChange: onValueChangeFn, props: newViewProps } },
        );
        const view = hookResult.result.current;

        const rows = view.getVisibleRows();
        expect(rows).toMatchObject(testItems.map((i) => ({ id: i.id, value: i })));
        expect(view.getVisibleRows()).toHaveLength(testItems.length);
    });

    describe('sorting', () => {
        it('should return rows in default order, if sorting do not passed', () => {
            const hookResult = renderHook(
                ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                { initialProps: { value: initialValue, onValueChange: onValueChangeFn, props: viewProps } },
            );

            let view = hookResult.result.current;
            hookResult.rerender({
                value: { ...initialValue, topIndex: 0, visibleCount: 20 },
                onValueChange: onValueChangeFn,
                props: viewProps,
            });

            view = hookResult.result.current;
            const rows = view.getVisibleRows();
            expect(rows[0].id).toEqual(2);
            expect(rows[4].id).toEqual(4);
        });

        it('should sort rows if set sorting to value', () => {
            const hookResult = renderHook(
                ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                { initialProps: { value: initialValue, onValueChange: onValueChangeFn, props: viewProps } },
            );

            let view = hookResult.result.current;
            hookResult.rerender({
                value: { ...initialValue, sorting: [{ field: 'id', direction: 'asc' }], topIndex: 0, visibleCount: 20 },
                onValueChange: onValueChangeFn,
                props: viewProps,
            });

            view = hookResult.result.current;
            const rows = view.getVisibleRows();
            expect(rows[0].id).toEqual(1);
            expect(rows[4].id).toEqual(5);
        });
    });

    describe('search', () => {
        let countriesDataSource: ArrayDataSource<Country, string>;
        let countriesViewProps: ArrayListViewProps<Country, string, any>;
        let countriesOnValueChange: (newValue: DataSourceState<Country, string>) => any;

        beforeEach(() => {
            countriesOnValueChange = jest.fn();

            countriesDataSource = new ArrayDataSource<Country, string>({
                items: countries,
                getId: (i) => i.id,
                getSearchFields: (item) => [item.name],
            });

            countriesViewProps = {
                getId: (i) => i.id,
                getSearchFields: (item) => [item.name],
                getRowOptions: () => ({
                    checkbox: {
                        isVisible: true,
                    },
                    isSelectable: true,
                }),
            };
            jest.clearAllMocks();
        });

        it('should search items', () => {
            const hookResult = renderHook(
                ({ value, onValueChange, props }) => countriesDataSource.useView(value, onValueChange, props),
                { initialProps: { value: initialValue, onValueChange: countriesOnValueChange, props: countriesViewProps } },
            );

            hookResult.rerender({
                value: { ...initialValue, search: 'ea', topIndex: 0, visibleCount: 20 },
                onValueChange: countriesOnValueChange,
                props: countriesViewProps,
            });

            const countriesView = hookResult.result.current;
            const rows = countriesView.getVisibleRows();
            const rowsIds = rows.map((i) => i.id);

            expect(rows).toHaveLength(2);
            expect(rowsIds).toEqual(['GN', 'GW']);
        });

        it('should search items by group of tokens', () => {
            const hookResult = renderHook(
                ({ value, onValueChange, props }) => countriesDataSource.useView(value, onValueChange, props),
                { initialProps: { value: initialValue, onValueChange: countriesOnValueChange, props: countriesViewProps } },
            );

            hookResult.rerender({
                value: { ...initialValue, search: 'ea bi', topIndex: 0, visibleCount: 20 },
                onValueChange: countriesOnValueChange,
                props: countriesViewProps,
            });

            const countriesView = hookResult.result.current;
            const rows = countriesView.getVisibleRows();
            const rowsIds = rows.map((i) => i.id);

            expect(rows).toHaveLength(1);
            expect(rowsIds).toEqual(['GW']);
        });

        it('should sort items in order of search relevance', () => {
            const hookResult = renderHook(
                ({ value, onValueChange, props }) => countriesDataSource.useView(value, onValueChange, props),
                { initialProps: { value: initialValue, onValueChange: countriesOnValueChange, props: countriesViewProps } },
            );

            hookResult.rerender({
                value: { ...initialValue, search: 'gu', topIndex: 0, visibleCount: 20 },
                onValueChange: countriesOnValueChange,
                props: countriesViewProps,
            });

            const countriesView = hookResult.result.current;
            const rows = countriesView.getVisibleRows();
            const rowsIds = rows.map((i) => i.id);

            expect(rows).toHaveLength(3);
            expect(rowsIds).toEqual(['GN', 'GW', 'NC']);
        });

        it('should not sort items in order of search relevance if sortSearchByRelevance = false', () => {
            const props: ArrayListViewProps<Country, string, any> = { ...countriesViewProps, sortSearchByRelevance: false };
            const hookResult = renderHook(
                ({ value, onValueChange, props }) => countriesDataSource.useView(value, onValueChange, props),
                { initialProps: { value: initialValue, onValueChange: countriesOnValueChange, props } },
            );

            hookResult.rerender({
                value: { ...initialValue, search: 'gu', topIndex: 0, visibleCount: 20 },
                onValueChange: countriesOnValueChange,
                props,
            });

            const countriesView = hookResult.result.current;
            const rows = countriesView.getVisibleRows();
            const rowsIds = rows.map((i) => i.id);

            expect(rows).toHaveLength(3);
            expect(rowsIds).toEqual(['NC', 'GN', 'GW']);
        });

        it('should not return items if group was not matched', () => {
            const hookResult = renderHook(
                ({ value, onValueChange, props }) => countriesDataSource.useView(value, onValueChange, props),
                { initialProps: { value: initialValue, onValueChange: countriesOnValueChange, props: countriesViewProps } },
            );

            hookResult.rerender({
                value: { ...initialValue, search: 'wa bx', topIndex: 0, visibleCount: 20 },
                onValueChange: countriesOnValueChange,
                props: countriesViewProps,
            });

            const countriesView = hookResult.result.current;
            const rows = countriesView.getVisibleRows();
            const rowsIds = rows.map((i) => i.id);

            expect(rows).toHaveLength(0);
            expect(rowsIds).toEqual([]);
        });
    });

    describe('updateTree', () => {
        const getFilter = (filter) => (item) => filter(item);
        const filter = (item) => item.parentId === 6;

        let currentValue = initialValue;
        const currentOnValueChange = (newValue: typeof currentValue) => {
            currentValue = newValue;
        };

        it('should update tree if filter was changed', () => {
            const hookResult = renderHook(
                ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                { initialProps: { value: currentValue, onValueChange: currentOnValueChange, props: viewProps } },
            );

            hookResult.rerender({
                value: { ...currentValue, topIndex: 0, visibleCount: 20, filter },
                onValueChange: currentOnValueChange,
                props: { ...viewProps, getFilter },
            });

            let view = hookResult.result.current;
            const rows = view.getVisibleRows();
            const rowsIds = rows.map((i) => i.id);

            expect(rows).toHaveLength(1);
            expect(rowsIds).toEqual([6]);

            const [row] = rows;
            row.onFold?.(row);

            hookResult.rerender({
                value: { ...currentValue, topIndex: 0, visibleCount: 20, filter },
                onValueChange: currentOnValueChange,
                props: { ...viewProps, getFilter },
            });

            view = hookResult.result.current;

            const unfoldedRows = view.getVisibleRows();
            const unfoldedRowsIds = unfoldedRows.map((i) => i.id);
            expect(unfoldedRows).toHaveLength(4);
            expect(unfoldedRowsIds).toEqual([
                6, 7, 8, 9,
            ]);
        });

        it('should update tree if filter and search was changed', () => {
            const hookResult = renderHook(
                ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                { initialProps: { value: currentValue, onValueChange: currentOnValueChange, props: viewProps } },
            );

            hookResult.rerender({
                value: { ...currentValue, topIndex: 0, visibleCount: 20, filter, search: 'B1' },
                onValueChange: currentOnValueChange,
                props: { ...viewProps, getFilter },
            });

            const view = hookResult.result.current;
            const rows = view.getVisibleRows();
            const rowsIds = rows.map((i) => i.id);

            expect(rows).toHaveLength(2);
            expect(rowsIds).toEqual([6, 7]);
        });

        it('should update tree if filter, search and sorting was changed', () => {
            const hookResult = renderHook(
                ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                { initialProps: { value: currentValue, onValueChange: currentOnValueChange, props: viewProps } },
            );

            hookResult.rerender({
                value: {
                    ...currentValue,
                    topIndex: 0,
                    visibleCount: 20,
                    filter,
                    search: 'B',
                    sorting: [{ field: 'level', direction: 'desc' as SortDirection }],
                },
                onValueChange: currentOnValueChange,
                props: { ...viewProps, getFilter },
            });

            const view = hookResult.result.current;
            const rows = view.getVisibleRows();
            const rowsIds = rows.map((i) => i.id);

            expect(rows).toHaveLength(4);
            expect(rowsIds).toEqual([
                6, 9, 8, 7,
            ]);
        });
    });

    describe('rows check', () => {
        describe('cascadeSelection = false', () => {
            it('should select item in single mode', () => {
                const hookResult = renderHook(
                    ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                    { initialProps: { value: initialValue, onValueChange: onValueChangeFn, props: viewProps } },
                );

                const view = hookResult.result.current;

                const row = view.getById(6, 6);
                row.onSelect?.(row);

                expect(onValueChangeFn).toBeCalledWith({ ...initialValue, selectedId: 6 });
            });

            it('onCheck handler should set id to checked array in value', async () => {
                const hookResult = renderHook(
                    ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                    { initialProps: { value: initialValue, onValueChange: onValueChangeFn, props: viewProps } },
                );

                let view = hookResult.result.current;
                const row1 = view.getById(6, 6);
                row1.onCheck?.(row1);
                expect(onValueChangeFn).toHaveBeenCalledWith({ ...initialValue, checked: [6] });

                hookResult.rerender({ value: { ...initialValue, checked: [6] }, onValueChange: onValueChangeFn, props: viewProps });
                view = hookResult.result.current;

                const row2 = view.getById(7, 7);
                row2.onCheck?.(row2);

                expect(onValueChangeFn).toHaveBeenCalledWith({ ...initialValue, checked: [6, 7] });
            });
        });

        describe("cascadeSelection = true | cascadeSelection = 'explicit'", () => {
            it.each<[CascadeSelection]>([[true], ['explicit']])('should check all children when parent checked with cascadeSelection = %s', (cascadeSelection) => {
                const currentViewProps: ArrayListViewProps<TItem, number, any> = {
                    getId: (i) => i.id,
                    cascadeSelection,
                    getRowOptions: () => ({
                        checkbox: { isVisible: true },
                    }),
                };

                const hookResult = renderHook(
                    ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                    { initialProps: { value: initialValue, onValueChange: onValueChangeFn, props: currentViewProps } },
                );

                const view = hookResult.result.current;
                const row1 = view.getById(6, 6);
                row1.onCheck?.(row1);

                expect(onValueChangeFn).toBeCalledWith({
                    ...initialValue,
                    checked: [
                        6, 7, 8, 9,
                    ],
                });
            });

            it.each<[CascadeSelection]>([[true], ['explicit']])('should check parent if all siblings checked with cascadeSelection = %s', (cascadeSelection) => {
                const currentViewProps: ArrayListViewProps<TItem, number, any> = {
                    getId: (i) => i.id,
                    cascadeSelection,
                    getRowOptions: () => ({
                        checkbox: { isVisible: true },
                    }),
                };

                const hookResult = renderHook(
                    ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                    { initialProps: { value: { ...initialValue, checked: [7, 8] }, onValueChange: onValueChangeFn, props: currentViewProps } },
                );

                const view = hookResult.result.current;

                const row = view.getById(9, 9);
                row.onCheck?.(row);

                expect(onValueChangeFn).toBeCalledWith({
                    ...initialValue,
                    checked: [
                        7, 8, 9, 6,
                    ],
                });
            });

            it.each<[CascadeSelection]>([[true], ['explicit']])('should select all top items with cascadeSelection = %s', (cascadeSelection) => {
                const currentViewProps: ArrayListViewProps<TItem, number, any> = {
                    getId: (i) => i.id,
                    cascadeSelection,
                    getRowOptions: () => ({
                        checkbox: { isVisible: true },
                    }),
                };
                const hookResult = renderHook(
                    ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                    { initialProps: { value: { ...initialValue, checked: [7, 8] }, onValueChange: onValueChangeFn, props: currentViewProps } },
                );

                const view = hookResult.result.current;
                view.selectAll?.onValueChange(true);

                expect(onValueChangeFn).toBeCalledWith({
                    ...initialValue,
                    checked: [
                        7, 8, 2, 5, 1, 3, 4, 6, 9, 10, 11, 12,
                    ],
                });
            });
        });

        describe("cascadeSelection = 'implicit'", () => {
            it('should check only parent when parent checked with cascadeSelection = implicit', () => {
                const currentViewProps: ArrayListViewProps<TItem, number, any> = {
                    getId: (i) => i.id,
                    cascadeSelection: 'implicit',
                    getRowOptions: () => ({
                        checkbox: { isVisible: true },
                    }),
                };
                const hookResult = renderHook(
                    ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                    { initialProps: { value: initialValue, onValueChange: onValueChangeFn, props: currentViewProps } },
                );
                const view = hookResult.result.current;

                const row1 = view.getById(6, 6);
                row1.onCheck?.(row1);

                expect(onValueChangeFn).toBeCalledWith({ ...initialValue, checked: [6] });
            });

            it('should check parent if all siblings checked with cascadeSelection = implicit', () => {
                const currentViewProps: ArrayListViewProps<TItem, number, any> = {
                    getId: (i) => i.id,
                    cascadeSelection: 'implicit',
                    getRowOptions: () => ({
                        checkbox: { isVisible: true },
                    }),
                };
                const hookResult = renderHook(
                    ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                    { initialProps: { value: { ...initialValue, checked: [7, 8] }, onValueChange: onValueChangeFn, props: currentViewProps } },
                );
                const view = hookResult.result.current;

                const row = view.getById(9, 9);
                row.onCheck?.(row);

                expect(onValueChangeFn).toBeCalledWith({ ...initialValue, checked: [6] });
            });

            it('should select all top items with cascadeSelection = implicit', () => {
                const currentViewProps: ArrayListViewProps<TItem, number, any> = {
                    getId: (i) => i.id,
                    cascadeSelection: 'implicit',
                    getRowOptions: () => ({
                        checkbox: { isVisible: true },
                    }),
                };
                const hookResult = renderHook(
                    ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                    { initialProps: { value: { ...initialValue, checked: [7, 8] }, onValueChange: onValueChangeFn, props: currentViewProps } },
                );
                const view = hookResult.result.current;

                view.selectAll?.onValueChange(true);

                expect(onValueChangeFn).toBeCalledWith({
                    ...initialValue,
                    checked: [
                        2, 5, 1, 3, 4, 6, 10, 11, 12,
                    ],
                });
            });
        });
    });

    it('should set focusedItem', () => {
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
            { initialProps: { value: initialValue, onValueChange: onValueChangeFn, props: viewProps } },
        );
        const view = hookResult.result.current;
        const row = view.getById(6, 6);
        row.onFocus?.(row.index);

        expect(onValueChangeFn).toBeCalledWith({ ...initialValue, focusedIndex: row.index });
    });

    it('should fold/unfold item', () => {
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
            { initialProps: { value: initialValue, onValueChange: onValueChangeFn, props: viewProps } },
        );
        const view = hookResult.result.current;
        const row = view.getVisibleRows()[5];
        row.onFold?.(row);

        expect(onValueChangeFn).toBeCalledWith({ ...initialValue, folded: { [row.id]: !row.isFolded } });
    });

    it('should return selected rows in selection order', () => {
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
            { initialProps: { value: initialValue, onValueChange: onValueChangeFn, props: viewProps } },
        );

        hookResult.rerender({ value: { ...initialValue, checked: [6, 5, 4] }, onValueChange: onValueChangeFn, props: viewProps });
        const view = hookResult.result.current;

        const selectedRows = view.getSelectedRows();
        expect(selectedRows.map(({ id }) => id)).toEqual([
            6, 5, 4,
        ]);
    });
});
