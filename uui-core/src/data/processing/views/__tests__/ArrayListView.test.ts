import { act, renderHook, waitFor } from '@epam/uui-test-utils';
import { ArrayDataSource, ArrayDataSourceProps } from '../../ArrayDataSource';
import { CascadeSelection, DataQueryFilter, DataRowProps, DataSourceState, IDataSourceView, SortDirection } from '../../../../types';
import isEqual from 'react-fast-compare';
import { ArrayListViewProps } from '../types';
import { LocationItem, getArrayLocationsDS } from '../../__tests__/mocks';

interface TItem {
    id: number;
    level: string;
    parentId?: number;
}

interface TestItem {
    id: number;
    parentId?: number;
    childrenCount?: number;
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

let dataSource: ArrayDataSource<TItem, number, any>;

let onValueChangeFn: (newValue: DataSourceState<any, number> | ((value: DataSourceState<any, number>) => DataSourceState<any, number>)) => any;
const initialValue: DataSourceState = { topIndex: 0, visibleCount: totalRowsCount };
let currentValue = initialValue;
let viewProps: ArrayListViewProps<TItem, number, any>;

describe('ArrayListView', () => {
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

    testData.forEach((i) => {
        i.childrenCount = testData.filter((x) => x.parentId === i.id).length;
    });

    const testDataById = (Object as any).fromEntries(testData.map((i) => [i.id, i]));

    function expectViewToLookLike(
        view: IDataSourceView<TestItem, number, DataQueryFilter<TestItem>>,
        rows: Partial<DataRowProps<TestItem, number>>[],
    ) {
        const viewRows = view.getVisibleRows();

        rows.forEach((r) => {
            if (r.id) {
                r.value = testDataById[r.id];
            }
        });
        expect(viewRows).toEqual(rows.map((r) => expect.objectContaining(r)));
    }

    const treeDataSource = new ArrayDataSource({
        items: testData,
        getId: (i) => i.id,
        getParentId: (i) => i.parentId,
    });

    beforeEach(() => {
        jest.clearAllMocks();

        currentValue = initialValue;
        onValueChangeFn = jest.fn().mockImplementation((newValue) => {
            if (typeof newValue === 'function') {
                currentValue = newValue(currentValue);
                return;
            }
            currentValue = newValue;
        });

        dataSource = new ArrayDataSource<TItem, number, any>({
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
            const getFilter = (filter) => (item) => filter(item);
            const filter = (item) => item.parentId === 6;

            const hookResult = renderHook(
                ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                { initialProps: { value: { ...initialValue, filter }, onValueChange: onValueChangeFn, props: { ...viewProps, getFilter } } },
            );

            let view = hookResult.result.current;

            const rows = view.getVisibleRows();

            hookResult.rerender({ value: { filter: () => true }, onValueChange: onValueChangeFn, props: { ...viewProps, getFilter } });
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

            let view = hookResult.result.current;

            hookResult.rerender({ value: { ...initialValue, focusedIndex: 1 }, onValueChange: onValueChangeFn, props: viewProps });
            view = hookResult.result.current;

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
        let countriesOnValueChange: (newValue: DataSourceState<any, string> | ((value: DataSourceState<any, string>) => DataSourceState<any, string>)) => any;

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

    describe('tree-search', () => {
        const onValueChanged = (newValue: React.SetStateAction<DataSourceState<Record<string, any>, any>>) => {
            if (typeof newValue === 'function') {
                currentValue = newValue(currentValue);
                return;
            }
            currentValue = newValue;
        };

        beforeEach(() => {
            currentValue = { visibleCount: 5 };
        });

        function expectRows(
            view: IDataSourceView<LocationItem, string, DataQueryFilter<LocationItem>>,
            rows: Partial<DataRowProps<LocationItem, string>>[],
        ) {
            const viewRows = view.getVisibleRows();
            expect(viewRows).toEqual(rows.map((r) => expect.objectContaining(r)));
        }

        it('should show unfolded tree results', async () => {
            const locationsDS = getArrayLocationsDS({
                getSearchFields: ({ name }) => [name],
            });

            currentValue.search = 'Zeral';
            const hookResult = renderHook(
                ({ value, onValueChange, props }) => locationsDS.useView(value, onValueChange, props),
                { initialProps: {
                    value: currentValue,
                    onValueChange: onValueChanged,
                    props: {},
                } },
            );

            let view = hookResult.result.current;

            const listProps = view.getListProps();
            expect(listProps.isReloading).toBeFalsy();

            await waitFor(() => {
                view = hookResult.result.current;
                expectRows(
                    view,
                    [
                        { id: 'c-AF', isFolded: false, indent: 1, depth: 0 },
                        { id: 'DZ', isFolded: false, indent: 2, depth: 1 },
                        { id: '2474583', isFolded: false, indent: 3, depth: 2 },
                    ],
                );
            });
        });

        it.each<CascadeSelection>([true, 'explicit'])('should check all children for search results with cascadeSelection = %s', async (cascadeSelection) => {
            const locationsDS = getArrayLocationsDS({
                cascadeSelection,
                getSearchFields: ({ name }) => [name],
                rowOptions: { checkbox: { isVisible: true } },
            });

            currentValue.search = 'Zeral';
            const hookResult = renderHook(
                ({ value, onValueChange, props }) => locationsDS.useView(value, onValueChange, props),
                { initialProps: {
                    value: currentValue,
                    onValueChange: onValueChanged,
                    props: {},
                } },
            );

            let view = hookResult.result.current;
            const listProps = view.getListProps();
            expect(listProps.isReloading).toBeFalsy();

            view = hookResult.result.current;
            expectRows(
                view,
                [
                    { id: 'c-AF', isChecked: false, isChildrenChecked: false, isFolded: false, indent: 1, depth: 0 },
                    { id: 'DZ', isChecked: false, isChildrenChecked: false, isFolded: false, indent: 2, depth: 1 },
                    { id: '2474583', isChecked: false, isChildrenChecked: false, isFolded: false, indent: 3, depth: 2 },
                ],
            );

            const rows = view.getVisibleRows();
            const rowDZ = rows[1];

            await act(() => {
                rowDZ.onCheck?.(rowDZ);
            });

            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

            await waitFor(() => {
                view = hookResult.result.current;
                expectRows(
                    view,
                    [
                        { id: 'c-AF', isChecked: false, isChildrenChecked: true, isFolded: false, indent: 1, depth: 0 },
                        { id: 'DZ', isChecked: true, isChildrenChecked: true, isFolded: false, indent: 2, depth: 1 },
                        { id: '2474583', isChecked: true, isFolded: false, indent: 3, depth: 2 },
                    ],
                );
            });

            expect(currentValue.checked).toEqual([
                'DZ',
                '2474141',
                '2475744',
                '2475740',
                '2475752',
                '2475687',
                '2475612',
                '2475475',
                '2474638',
                '2474583',
                '2474506',
            ]);

            currentValue.search = 'Touggourt';
            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

            await waitFor(() => {
                view = hookResult.result.current;
                expectRows(
                    view,
                    [
                        { id: 'c-AF', isChecked: false, isChildrenChecked: true, isFolded: false, indent: 1, depth: 0 },
                        { id: 'DZ', isChecked: true, isChildrenChecked: true, isFolded: false, indent: 2, depth: 1 },
                        { id: '2475475', isChecked: true, isFolded: false, indent: 3, depth: 2 },
                    ],
                );
            });

            const rowTouggourt = view.getVisibleRows()[2];

            await act(() => {
                rowTouggourt.onCheck?.(rowTouggourt);
            });

            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });
            await waitFor(() => {
                view = hookResult.result.current;
                expectRows(
                    view,
                    [
                        { id: 'c-AF', isChecked: false, isChildrenChecked: true, isFolded: false, indent: 1, depth: 0 },
                        { id: 'DZ', isChecked: false, isChildrenChecked: true, isFolded: false, indent: 2, depth: 1 },
                        { id: '2475475', isChecked: false, isFolded: false, indent: 3, depth: 2 },
                    ],
                );
            });

            currentValue.search = '';
            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });
            await waitFor(() => {
                view = hookResult.result.current;
                expectRows(
                    view,
                    [
                        { id: 'c-AF', isChecked: false, isChildrenChecked: true, isFolded: true, indent: 1, depth: 0 },
                        { id: 'c-EU', isChecked: false, isChildrenChecked: false, isFolded: true, indent: 1, depth: 0 },
                    ],
                );
            });
        });

        it('should check all children for search results with cascadeSelection = implicit', async () => {
            const locationsDS = getArrayLocationsDS({
                cascadeSelection: 'implicit',
                getSearchFields: ({ name }) => [name],
                rowOptions: { checkbox: { isVisible: true } },
            });

            currentValue.search = 'Zeral';
            const hookResult = renderHook(
                ({ value, onValueChange, props }) => locationsDS.useView(value, onValueChange, props),
                { initialProps: {
                    value: currentValue,
                    onValueChange: onValueChanged,
                    props: {},
                } },
            );

            let view = hookResult.result.current;
            const listProps = view.getListProps();
            expect(listProps.isReloading).toBeFalsy();

            await waitFor(() => {
                view = hookResult.result.current;
                expectRows(
                    view,
                    [
                        { id: 'c-AF', isChecked: false, isChildrenChecked: false, isFolded: false, indent: 1, depth: 0 },
                        { id: 'DZ', isChecked: false, isChildrenChecked: false, isFolded: false, indent: 2, depth: 1 },
                        { id: '2474583', isChecked: false, isChildrenChecked: false, isFolded: false, indent: 3, depth: 2 },
                    ],
                );
            });

            const rows = view.getVisibleRows();
            const rowDZ = rows[1];

            await act(() => {
                rowDZ.onCheck?.(rowDZ);
            });

            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

            await waitFor(() => {
                view = hookResult.result.current;
                expectRows(
                    view,
                    [
                        { id: 'c-AF', isChecked: false, isChildrenChecked: true, isFolded: false, indent: 1, depth: 0 },
                        { id: 'DZ', isChecked: true, isChildrenChecked: true, isFolded: false, indent: 2, depth: 1 },
                        { id: '2474583', isChecked: true, isFolded: false, indent: 3, depth: 2 },
                    ],
                );
            });

            expect(currentValue.checked).toEqual(['DZ']);

            currentValue.search = 'Touggourt';
            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

            await waitFor(() => {
                view = hookResult.result.current;
                expectRows(
                    view,
                    [
                        { id: 'c-AF', isChecked: false, isChildrenChecked: true, isFolded: false, indent: 1, depth: 0 },
                        { id: 'DZ', isChecked: true, isChildrenChecked: true, isFolded: false, indent: 2, depth: 1 },
                        { id: '2475475', isChecked: true, isFolded: false, indent: 3, depth: 2 },
                    ],
                );
            });

            const rowTouggourt = view.getVisibleRows()[2];

            await act(() => {
                rowTouggourt.onCheck?.(rowTouggourt);
            });

            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });
            await waitFor(() => {
                view = hookResult.result.current;
                expectRows(
                    view,
                    [
                        { id: 'c-AF', isChecked: false, isChildrenChecked: true, isFolded: false, indent: 1, depth: 0 },
                        { id: 'DZ', isChecked: false, isChildrenChecked: true, isFolded: false, indent: 2, depth: 1 },
                        { id: '2475475', isChecked: false, isFolded: false, indent: 3, depth: 2 },
                    ],
                );
            });

            currentValue.search = '';
            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });
            await waitFor(() => {
                view = hookResult.result.current;
                expectRows(
                    view,
                    [
                        { id: 'c-AF', isChecked: false, isChildrenChecked: true, isFolded: true, indent: 1, depth: 0 },
                        { id: 'c-EU', isChecked: false, isChildrenChecked: false, isFolded: true, indent: 1, depth: 0 },
                    ],
                );
            });
        });

        it('should check all children for search results with cascadeSelection = false', async () => {
            const locationsDS = getArrayLocationsDS({
                cascadeSelection: false,
                getSearchFields: ({ name }) => [name],
                rowOptions: { checkbox: { isVisible: true } },
            });

            currentValue.search = 'Zeral';
            const hookResult = renderHook(
                ({ value, onValueChange, props }) => locationsDS.useView(value, onValueChange, props),
                { initialProps: {
                    value: currentValue,
                    onValueChange: onValueChanged,
                    props: {},
                } },
            );

            let view = hookResult.result.current;
            const listProps = view.getListProps();
            expect(listProps.isReloading).toBeFalsy();

            await waitFor(() => {
                view = hookResult.result.current;
                expectRows(
                    view,
                    [
                        { id: 'c-AF', isChecked: false, isChildrenChecked: false, isFolded: false, indent: 1, depth: 0 },
                        { id: 'DZ', isChecked: false, isChildrenChecked: false, isFolded: false, indent: 2, depth: 1 },
                        { id: '2474583', isChecked: false, isChildrenChecked: false, isFolded: false, indent: 3, depth: 2 },
                    ],
                );
            });

            const rows = view.getVisibleRows();
            const rowDZ = rows[1];

            await act(() => {
                rowDZ.onCheck?.(rowDZ);
            });

            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

            await waitFor(() => {
                view = hookResult.result.current;
                expectRows(
                    view,
                    [
                        { id: 'c-AF', isChecked: false, isChildrenChecked: true, isFolded: false, indent: 1, depth: 0 },
                        { id: 'DZ', isChecked: true, isChildrenChecked: false, isFolded: false, indent: 2, depth: 1 },
                        { id: '2474583', isChecked: false, isFolded: false, indent: 3, depth: 2 },
                    ],
                );
            });

            expect(currentValue.checked).toEqual(['DZ']);

            currentValue.search = 'Benin';
            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

            await waitFor(() => {
                view = hookResult.result.current;
                expectRows(
                    view,
                    [
                        { id: 'c-AF', isChecked: false, isChildrenChecked: true, isFolded: false, indent: 1, depth: 0 },
                        { id: 'BJ', isChecked: false, isChildrenChecked: false, isFolded: false, indent: 2, depth: 1 },
                    ],
                );
            });

            currentValue.search = '';
            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });
            await waitFor(() => {
                view = hookResult.result.current;
                expectRows(
                    view,
                    [
                        { id: 'c-AF', isChecked: false, isChildrenChecked: true, isFolded: true, indent: 1, depth: 0 },
                        { id: 'c-EU', isChecked: false, isChildrenChecked: false, isFolded: true, indent: 1, depth: 0 },
                    ],
                );
            });
        });
    });

    describe('updateTree', () => {
        const getFilter = (filter) => (item) => filter(item);
        const filter = (item) => item.parentId === 6;

        it('should update tree if filter was changed', async () => {
            const hookResult = renderHook(
                ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                { initialProps: { value: currentValue, onValueChange: onValueChangeFn, props: viewProps } },
            );

            hookResult.rerender({
                value: { ...currentValue, topIndex: 0, visibleCount: 20, filter },
                onValueChange: onValueChangeFn,
                props: { ...viewProps, getFilter },
            });

            let view = hookResult.result.current;
            const rows = view.getVisibleRows();
            const rowsIds = rows.map((i) => i.id);

            expect(rows).toHaveLength(1);
            expect(rowsIds).toEqual([6]);

            const [row] = rows;
            await act(() => {
                row.onFold?.(row);
            });

            hookResult.rerender({
                value: { ...currentValue, topIndex: 0, visibleCount: 20, filter },
                onValueChange: onValueChangeFn,
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
                { initialProps: { value: currentValue, onValueChange: onValueChangeFn, props: viewProps } },
            );

            hookResult.rerender({
                value: { ...currentValue, topIndex: 0, visibleCount: 20, filter, search: 'B1' },
                onValueChange: onValueChangeFn,
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
                { initialProps: { value: currentValue, onValueChange: onValueChangeFn, props: viewProps } },
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
                onValueChange: onValueChangeFn,
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
        let updatedValue = { ...initialValue };
        const onValueChanged = (newValue: React.SetStateAction<DataSourceState<Record<string, any>, any>>) => {
            if (typeof newValue === 'function') {
                updatedValue = newValue(updatedValue);
                return;
            }
            updatedValue = newValue;
        };

        beforeEach(() => {
            updatedValue = { ...initialValue };
        });

        function expectRows(
            view: IDataSourceView<LocationItem, string, DataQueryFilter<LocationItem>>,
            rows: Partial<DataRowProps<LocationItem, string>>[],
        ) {
            const viewRows = view.getVisibleRows();
            expect(viewRows).toEqual(rows.map((r) => expect.objectContaining(r)));
        }

        describe('cascadeSelection = false', () => {
            it('should select item in single mode', () => {
                const hookResult = renderHook(
                    ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                    { initialProps: { value: initialValue, onValueChange: onValueChangeFn, props: viewProps } },
                );

                const view = hookResult.result.current;

                const row = view.getById(6, 6);
                row.onSelect?.(row);

                expect(onValueChangeFn).toBeCalledTimes(1);
                expect(currentValue).toEqual({
                    ...initialValue,
                    selectedId: 6,
                });
            });

            it('onCheck handler should set id to checked array in value', async () => {
                const hookResult = renderHook(
                    ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                    { initialProps: { value: initialValue, onValueChange: onValueChangeFn, props: viewProps } },
                );

                let view = hookResult.result.current;
                const row1 = view.getById(6, 6);

                await act(() => {
                    row1.onCheck?.(row1);
                });

                expect(onValueChangeFn).toBeCalledTimes(1);
                expect(currentValue).toEqual({
                    ...initialValue,
                    checked: [6],
                });

                hookResult.rerender({ value: { ...initialValue, checked: [6] }, onValueChange: onValueChangeFn, props: viewProps });
                view = hookResult.result.current;

                const row2 = view.getById(7, 7);
                await act(() => {
                    row2.onCheck?.(row2);
                });

                expect(onValueChangeFn).toBeCalledTimes(2);
                expect(currentValue).toEqual({
                    ...initialValue,
                    checked: [6, 7],
                });
            });

            it('should clear specific unknown record', async () => {
                const unknownId = '-10000';
                updatedValue = { ...updatedValue, checked: [unknownId, 'BJ'] };

                const locationsDS = getArrayLocationsDS({
                    cascadeSelection: false,
                    showSelectedOnly: true,
                });

                const hookResult = renderHook(
                    ({ value, onValueChange, props }) => locationsDS.useView(value, onValueChange, props),
                    { initialProps: {
                        value: updatedValue,
                        onValueChange: onValueChanged,
                        props: {},
                    } },
                );

                await waitFor(() => {
                    const view = hookResult.result.current;
                    expectRows(
                        view,
                        [
                            { id: 'BJ', isChecked: true },
                        ],
                    );
                });
                const view = hookResult.result.current;
                const unknownRow = view.getById(unknownId, -1000);

                expect(unknownRow).toEqual(expect.objectContaining({ id: unknownId, isUnknown: true, value: undefined, isChecked: true }));

                await act(() => {
                    unknownRow.onCheck?.(unknownRow);
                });

                hookResult.rerender({ value: updatedValue, onValueChange: onValueChangeFn, props: {} });

                expect(updatedValue.checked).toEqual(['BJ']);
            });

            it('should clear unknown record via clearAll', async () => {
                const unknownId = '-10000';
                updatedValue = { ...updatedValue, checked: [unknownId, 'BJ'] };

                const locationsDS = getArrayLocationsDS({
                    cascadeSelection: false,
                    showSelectedOnly: true,
                    rowOptions: {
                        checkbox: {
                            isVisible: true,
                            isDisabled: false,
                        },
                    },
                });

                const hookResult = renderHook(
                    ({ value, onValueChange, props }) => locationsDS.useView(value, onValueChange, props),
                    { initialProps: {
                        value: updatedValue,
                        onValueChange: onValueChanged,
                        props: {},
                    } },
                );

                expect(updatedValue.checked).toEqual([unknownId, 'BJ']);
                await waitFor(() => {
                    const view = hookResult.result.current;
                    expectRows(
                        view,
                        [
                            { id: 'BJ', isChecked: true },
                        ],
                    );
                });
                const view = hookResult.result.current;
                const unknownRow = view.getById(unknownId, -1000);

                expect(unknownRow).toEqual(expect.objectContaining({ id: unknownId, isUnknown: true, value: undefined, isChecked: true }));

                await act(() => {
                    view.clearAllChecked();
                });

                hookResult.rerender({ value: updatedValue, onValueChange: onValueChangeFn, props: {} });

                await waitFor(() => {
                    expect(updatedValue.checked).toEqual([]);
                });
            });
        });

        it('should select all top items with cascadeSelection = false', async () => {
            const currentViewProps: ArrayListViewProps<TItem, number, any> = {
                getId: (i) => i.id,
                cascadeSelection: false,
                getRowOptions: () => ({
                    checkbox: { isVisible: true },
                }),
            };
            const hookResult = renderHook(
                ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                { initialProps: { value: { ...initialValue, checked: [7, 8] }, onValueChange: onValueChangeFn, props: currentViewProps } },
            );

            const view = hookResult.result.current;
            await act(() => {
                view.selectAll?.onValueChange(true);
            });

            expect(onValueChangeFn).toBeCalledTimes(1);
            expect(currentValue).toEqual({
                ...initialValue,
                checked: [
                    7, 8, 2, 5, 1, 3, 4, 6, 9, 10, 11, 12,
                ],
            });

            await act(() => {
                view.selectAll?.onValueChange(false);
            });

            expect(onValueChangeFn).toBeCalledTimes(2);
            expect(currentValue).toEqual({
                ...initialValue,
                checked: [],
            });
        });

        describe("cascadeSelection = true | cascadeSelection = 'explicit'", () => {
            it.each<[CascadeSelection]>([[true], ['explicit']])('should check all children when parent checked with cascadeSelection = %s', async (cascadeSelection) => {
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

                await act(() => {
                    row1.onCheck?.(row1);
                });

                expect(onValueChangeFn).toBeCalledTimes(1);
                expect(currentValue).toEqual({
                    ...initialValue,
                    checked: [
                        6, 7, 8, 9,
                    ],
                });
            });

            it.each<[CascadeSelection]>([[true], ['explicit']])('should check parent if all siblings checked with cascadeSelection = %s', async (cascadeSelection) => {
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

                await act(() => {
                    row.onCheck?.(row);
                });

                expect(onValueChangeFn).toBeCalledTimes(1);
                expect(currentValue).toEqual({
                    ...initialValue,
                    checked: [
                        7, 8, 9, 6,
                    ],
                });
            });

            it.each<[CascadeSelection]>([[true], ['explicit']])('should select all top items with cascadeSelection = %s', async (cascadeSelection) => {
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
                await act(() => {
                    view.selectAll?.onValueChange(true);
                });

                expect(onValueChangeFn).toBeCalledTimes(1);
                expect(currentValue).toEqual({
                    ...initialValue,
                    checked: [
                        7, 8, 2, 5, 1, 3, 4, 6, 9, 10, 11, 12,
                    ],
                });

                await act(() => {
                    view.selectAll?.onValueChange(false);
                });

                expect(onValueChangeFn).toBeCalledTimes(2);
                expect(currentValue).toEqual({
                    ...initialValue,
                    checked: [],
                });
            });

            it.each<[CascadeSelection]>([[true], ['explicit']])('should clear specific unknown record', async (cascadeSelection) => {
                const unknownId = '-10000';
                updatedValue = { ...updatedValue, checked: [unknownId, 'BJ'] };

                const locationsDS = getArrayLocationsDS({
                    cascadeSelection,
                    showSelectedOnly: true,
                });

                const hookResult = renderHook(
                    ({ value, onValueChange, props }) => locationsDS.useView(value, onValueChange, props),
                    { initialProps: {
                        value: updatedValue,
                        onValueChange: onValueChanged,
                        props: {},
                    } },
                );

                await waitFor(() => {
                    const view = hookResult.result.current;
                    expectRows(
                        view,
                        [
                            { id: 'BJ', isChecked: true },
                        ],
                    );
                });
                const view = hookResult.result.current;
                const unknownRow = view.getById(unknownId, -1000);

                expect(unknownRow).toEqual(expect.objectContaining({ id: unknownId, isUnknown: true, value: undefined, isChecked: true }));

                await act(() => {
                    unknownRow.onCheck?.(unknownRow);
                });

                hookResult.rerender({ value: updatedValue, onValueChange: onValueChangeFn, props: {} });

                expect(updatedValue.checked).toEqual(['BJ']);
            });

            it.each<[CascadeSelection]>([[true], ['explicit']])('should clear unknown record via clearAll', async (cascadeSelection) => {
                const unknownId = '-10000';
                updatedValue = { ...updatedValue,
                    checked: [
                        'BJ',
                        '2392505',
                        '2392308',
                        '2392204',
                        '2392108',
                        '2392087',
                        '2392009',
                        '2391895',
                        '2391893',
                        '2391455',
                        '2391377',
                        unknownId,
                    ],
                };

                const locationsDS = getArrayLocationsDS({
                    cascadeSelection,
                    showSelectedOnly: true,
                    rowOptions: {
                        checkbox: {
                            isVisible: true,
                            isDisabled: false,
                        },
                    },
                });

                const hookResult = renderHook(
                    ({ value, onValueChange, props }) => locationsDS.useView(value, onValueChange, props),
                    { initialProps: {
                        value: updatedValue,
                        onValueChange: onValueChanged,
                        props: {},
                    } },
                );

                expect(updatedValue.checked).toEqual([
                    'BJ',
                    '2392505',
                    '2392308',
                    '2392204',
                    '2392108',
                    '2392087',
                    '2392009',
                    '2391895',
                    '2391893',
                    '2391455',
                    '2391377',
                    unknownId,
                ]);
                await waitFor(() => {
                    const view = hookResult.result.current;
                    expectRows(
                        view,
                        [
                            { id: 'BJ', isChecked: true },
                            { id: '2392505', isChecked: true },
                            { id: '2392308', isChecked: true },
                            { id: '2392204', isChecked: true },
                            { id: '2392108', isChecked: true },
                            { id: '2392087', isChecked: true },
                            { id: '2392009', isChecked: true },
                            { id: '2391895', isChecked: true },
                            { id: '2391893', isChecked: true },
                            { id: '2391455', isChecked: true },
                            { id: '2391377', isChecked: true },
                        ],
                    );
                });
                const view = hookResult.result.current;
                const unknownRow = view.getById(unknownId, -1000);

                expect(unknownRow).toEqual(expect.objectContaining({ id: unknownId, isUnknown: true, value: undefined, isChecked: true }));

                await act(() => {
                    view.clearAllChecked();
                });

                hookResult.rerender({ value: updatedValue, onValueChange: onValueChangeFn, props: {} });

                await waitFor(() => {
                    expect(updatedValue.checked).toEqual([]);
                });
            });
        });

        describe("cascadeSelection = 'implicit'", () => {
            it('should check only parent when parent checked with cascadeSelection = implicit', async () => {
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

                await act(() => {
                    row1.onCheck?.(row1);
                });

                expect(onValueChangeFn).toBeCalledTimes(1);
                expect(currentValue).toEqual({
                    ...initialValue,
                    checked: [6],
                });
            });

            it('should check parent if all siblings checked with cascadeSelection = implicit', async () => {
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
                await act(() => {
                    row.onCheck?.(row);
                });

                expect(onValueChangeFn).toBeCalledTimes(1);
                expect(currentValue).toEqual({
                    ...initialValue,
                    checked: [6],
                });
            });

            it('should select all top items with cascadeSelection = implicit', async () => {
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
                await act(() => {
                    view.selectAll?.onValueChange(true);
                });

                expect(onValueChangeFn).toBeCalledTimes(1);
                expect(currentValue).toEqual({
                    ...initialValue,
                    checked: [
                        2, 5, 1, 3, 4, 6, 10, 11, 12,
                    ],
                });

                await act(() => {
                    view.selectAll?.onValueChange(false);
                });

                expect(onValueChangeFn).toBeCalledTimes(2);
                expect(currentValue).toEqual({
                    ...initialValue,
                    checked: [],
                });
            });

            it('should clear specific unknown record', async () => {
                const unknownId = '-10000';
                updatedValue = { ...updatedValue, checked: [unknownId, 'BJ'] };

                const locationsDS = getArrayLocationsDS({
                    cascadeSelection: 'implicit',
                    showSelectedOnly: true,
                });

                const hookResult = renderHook(
                    ({ value, onValueChange, props }) => locationsDS.useView(value, onValueChange, props),
                    { initialProps: {
                        value: updatedValue,
                        onValueChange: onValueChanged,
                        props: {},
                    } },
                );

                await waitFor(() => {
                    const view = hookResult.result.current;
                    expectRows(
                        view,
                        [
                            { id: 'BJ', isChecked: true },
                        ],
                    );
                });
                const view = hookResult.result.current;
                const unknownRow = view.getById(unknownId, -1000);

                expect(unknownRow).toEqual(expect.objectContaining({ id: unknownId, isUnknown: true, value: undefined, isChecked: true }));

                await act(() => {
                    unknownRow.onCheck?.(unknownRow);
                });

                hookResult.rerender({ value: updatedValue, onValueChange: onValueChangeFn, props: {} });

                expect(updatedValue.checked).toEqual(['BJ']);
            });

            it('should clear unknown record via clearAll', async () => {
                const unknownId = '-10000';
                updatedValue = { ...updatedValue,
                    checked: [
                        'BJ',
                        unknownId,
                    ],
                };

                const locationsDS = getArrayLocationsDS({
                    cascadeSelection: 'implicit',
                    showSelectedOnly: true,
                    rowOptions: {
                        checkbox: {
                            isVisible: true,
                            isDisabled: false,
                        },
                    },
                });

                const hookResult = renderHook(
                    ({ value, onValueChange, props }) => locationsDS.useView(value, onValueChange, props),
                    { initialProps: {
                        value: updatedValue,
                        onValueChange: onValueChanged,
                        props: {},
                    } },
                );

                expect(updatedValue.checked).toEqual([
                    'BJ',
                    unknownId,
                ]);
                await waitFor(() => {
                    const view = hookResult.result.current;
                    expectRows(
                        view,
                        [
                            { id: 'BJ', isChecked: true },
                        ],
                    );
                });
                const view = hookResult.result.current;
                const unknownRow = view.getById(unknownId, -1000);

                expect(unknownRow).toEqual(expect.objectContaining({ id: unknownId, isUnknown: true, value: undefined, isChecked: true }));

                await act(() => {
                    view.clearAllChecked();
                });

                hookResult.rerender({ value: updatedValue, onValueChange: onValueChangeFn, props: {} });

                await waitFor(() => {
                    expect(updatedValue.checked).toEqual([]);
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

        expect(onValueChangeFn).toBeCalledTimes(1);
        expect(currentValue).toEqual({ ...initialValue, focusedIndex: row.index });
    });

    it('should fold/unfold item', () => {
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
            { initialProps: { value: initialValue, onValueChange: onValueChangeFn, props: viewProps } },
        );
        const view = hookResult.result.current;
        const row = view.getVisibleRows()[5];
        row.onFold?.(row);

        expect(onValueChangeFn).toBeCalledTimes(1);
        expect(currentValue).toEqual({ ...initialValue, folded: { [row.id]: !row.isFolded } });
    });

    it('Correctly computes path and isLastChild', async () => {
        currentValue.folded = { 120: true };
        currentValue.visibleCount = 10;

        const hookResult = renderHook(
            ({ value, onValueChange }) => treeDataSource.useView(value, onValueChange, {
                cascadeSelection: true,
                getRowOptions: () => ({ checkbox: { isVisible: true } }),
                isFoldedByDefault: () => false,
            }),
            { initialProps: { value: currentValue, onValueChange: onValueChangeFn } },
        );

        await waitFor(() => {
            const view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { id: 100, path: [], isLastChild: false },
                    { id: 110, path: [{ id: 100, isLastChild: false, value: testDataById[100] }], isLastChild: false },
                    { id: 120, path: [{ id: 100, isLastChild: false, value: testDataById[100] }], isLastChild: true },
                    { id: 200, path: [], isLastChild: false },
                    { id: 300, path: [], isLastChild: true },
                    { id: 310, path: [{ id: 300, isLastChild: true, value: testDataById[300] }], isLastChild: false },
                    { id: 320, path: [{ id: 300, isLastChild: true, value: testDataById[300] }], isLastChild: false },
                    { id: 330, path: [{ id: 300, isLastChild: true, value: testDataById[300] }], isLastChild: true },
                ],
            );
        });

        currentValue.folded = { 120: false };
        hookResult.rerender({ value: currentValue, onValueChange: onValueChangeFn });

        let view = hookResult.result.current;
        expect(view.getListProps().rowsCount).toBe(10);

        await waitFor(() => {
            view = hookResult.result.current;

            expectViewToLookLike(
                view,
                [
                    { id: 100, path: [], isLastChild: false },
                    { id: 110, path: [{ id: 100, isLastChild: false, value: testDataById[100] }], isLastChild: false },
                    { id: 120, path: [{ id: 100, isLastChild: false, value: testDataById[100] }], isLastChild: true },
                    {
                        id: 121,
                        path: [{ id: 100, isLastChild: false, value: testDataById[100] }, { id: 120, isLastChild: true, value: testDataById[120] }],
                        isLastChild: false,
                    },
                    {
                        id: 122,
                        path: [{ id: 100, isLastChild: false, value: testDataById[100] }, { id: 120, isLastChild: true, value: testDataById[120] }],
                        isLastChild: true,
                    },
                    { id: 200, path: [], isLastChild: false },
                    { id: 300, path: [], isLastChild: true },
                    { id: 310, path: [{ id: 300, isLastChild: true, value: testDataById[300] }], isLastChild: false },
                    { id: 320, path: [{ id: 300, isLastChild: true, value: testDataById[300] }], isLastChild: false },
                    { id: 330, path: [{ id: 300, isLastChild: true, value: testDataById[300] }], isLastChild: true },
                ],
            );
        });
        expect(view.getListProps().rowsCount).toBe(10);
    });

    it('handles empty result', async () => {
        const props: Partial<ArrayDataSourceProps<TestItem, number, any>> = {
            getFilter: () => (item) => item.id === -100500,
        };

        const hookResult = renderHook(
            ({ value, onValueChange, props }) => treeDataSource.useView(value, onValueChange, props),
            { initialProps: { value: { visibleCount: 3, filter: { id: -100500 } }, onValueChange: onValueChangeFn, props } },
        );

        let view = hookResult.result.current;
        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, []);
        });

        expect(view.getListProps().rowsCount).toBe(0);
    });
});
