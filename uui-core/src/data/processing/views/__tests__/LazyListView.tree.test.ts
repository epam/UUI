import { LazyDataSource } from '../../LazyDataSource';
import { act, renderHook, waitFor } from '@epam/uui-test-utils';

import {
    DataSourceState, LazyDataSourceApiRequest, DataQueryFilter, DataRowProps, IDataSourceView,
} from '../../../../types';
import { runDataQuery } from '../../../querying/runDataQuery';
import { LocationItem, getLazyLocationsDS } from '../../__tests__/mocks';

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

    testData.forEach((i) => {
        i.childrenCount = testData.filter((x) => x.parentId === i.id).length;
    });

    const testDataById = (Object as any).fromEntries(testData.map((i) => [i.id, i]));

    let currentValue: DataSourceState;
    let onValueChanged = (newValue: React.SetStateAction<DataSourceState<Record<string, any>, any>>) => {
        if (typeof newValue === 'function') {
            currentValue = newValue(currentValue);
            return;
        }
        currentValue = newValue;
    };

    const testApi = jest.fn((rq: LazyDataSourceApiRequest<TestItem, number, DataQueryFilter<TestItem>>) => Promise.resolve(runDataQuery(testData, rq)));

    const treeDataSource = new LazyDataSource({
        api: (rq, ctx) =>
            ctx?.parent ? testApi({ ...rq, filter: { ...rq.filter, parentId: ctx.parentId } }) : testApi({ ...rq, filter: { ...rq.filter, parentId: { isNull: true } } }),
        getChildCount: (i) => i.childrenCount,
        getParentId: (i) => i.parentId,
    });

    beforeEach(() => {
        currentValue = { topIndex: 0, visibleCount: 3 };
        onValueChanged = (newValue: React.SetStateAction<DataSourceState<Record<string, any>, any>>) => {
            if (typeof newValue === 'function') {
                currentValue = newValue(currentValue);
                return;
            }
            currentValue = newValue;
        };
        testApi.mockClear();
    });

    it('testApi is ok', async () => {
        const data = await testApi({ filter: { parentId: 100 } });
        expect(data).toEqual({
            items: [testDataById[110], testDataById[120]],
            count: 2,
        });
    });

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

    it('can load tree, unfold nodes, and scroll down', async () => {
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => treeDataSource.useView(value, onValueChange, props),
            { initialProps: { value: currentValue, onValueChange: onValueChanged, props: {} } },
        );

        await waitFor(() => {
            const view = hookResult.result.current;
            expectViewToLookLike(view, [
                {
                    isLoading: true, depth: 0, indent: 0, path: [],
                }, {
                    isLoading: true, depth: 0, indent: 0, path: [],
                }, {
                    isLoading: true, depth: 0, indent: 0, path: [],
                },
            ]);
        });

        let view = hookResult.result.current;
        expect(view.getListProps().rowsCount).toBeGreaterThan(3);

        await waitFor(() => {
            expect(testApi).toBeCalledTimes(1);
        });

        testApi.mockClear();

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                {
                    id: 100, isFoldable: true, isFolded: true, path: [],
                }, { id: 200, isFoldable: false, path: [] }, {
                    id: 300, isFoldable: true, isFolded: true, path: [],
                },
            ]);
        });

        // Unfold some rows
        let rows = view.getVisibleRows();
        hookResult.rerender({ value: { ...currentValue, visibleCount: 6 }, onValueChange: onValueChanged, props: {} });

        await waitFor(() => {
            view = hookResult.result.current;
            rows = view.getVisibleRows();
            expect(typeof rows[0].onFold).toBe('function');
        });

        await act(async () => {
            rows[0].onFold?.(rows[0]);
        });

        hookResult.rerender({ value: { ...currentValue, visibleCount: 6 }, onValueChange: onValueChanged, props: {} });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 100, depth: 0, indent: 1 },
                { isLoading: true, depth: 1, indent: 2 },
                { isLoading: true, depth: 1, indent: 2 },
                { id: 200, depth: 0, indent: 1 },
                { id: 300, depth: 0, indent: 1 },
            ]);
        });
        let listProps = view.getListProps();
        expect(listProps.rowsCount).toEqual(5);

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                {
                    id: 100, isFolded: false, depth: 0, indent: 1, isFoldable: true,
                }, {
                    id: 110, depth: 1, indent: 2, isFoldable: false,
                }, {
                    id: 120, depth: 1, indent: 2, isFoldable: true,
                }, { id: 200, depth: 0, indent: 1 }, { id: 300, depth: 0, indent: 1 },
            ]);
        });

        listProps = view.getListProps();
        expect(listProps.rowsCount).toEqual(5);

        // Unfold more rows
        rows = view.getVisibleRows();

        await act(async () => {
            rows[2].onFold?.(rows[2]);
        });

        hookResult.rerender({ value: { ...currentValue, visibleCount: 6 }, onValueChange: onValueChanged, props: {} });
        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                {
                    id: 100, isFolded: false, depth: 0, indent: 1, isFoldable: true,
                }, {
                    id: 110, depth: 1, indent: 2, isFoldable: false,
                }, {
                    id: 120, depth: 1, indent: 2, isFoldable: true,
                }, { isLoading: true, depth: 2, indent: 3 }, { isLoading: true, depth: 2, indent: 3 }, { id: 200, depth: 0, indent: 1 },
            ]);
        });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                {
                    id: 100, isFolded: false, depth: 0, indent: 1, isFoldable: true,
                }, {
                    id: 110, depth: 1, indent: 2, isFoldable: false,
                }, {
                    id: 120, depth: 1, indent: 2, isFoldable: true,
                }, {
                    id: 121, depth: 2, indent: 3, isFoldable: false,
                }, {
                    id: 122, depth: 2, indent: 3, isFoldable: false,
                }, { id: 200, depth: 0, indent: 1 },
            ]);
        });

        // Scroll down to bottom
        hookResult.rerender({ value: { ...currentValue, topIndex: 5, visibleCount: 6 }, onValueChange: onValueChanged, props: {} });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [{ id: 200, depth: 0, indent: 1 }, { id: 300, depth: 0, indent: 1 }]);
        });

        listProps = view.getListProps();
        expect(listProps.rowsCount).toEqual(7);
    });

    it('Multi-level folding', async () => {
        currentValue.visibleCount = 10;
        const hookResult = renderHook(
            ({ value }) => treeDataSource.useView(value, onValueChanged, {
                cascadeSelection: true,
                getRowOptions: () => ({ checkbox: { isVisible: true } }),
                isFoldedByDefault: () => false,
            }),
            { initialProps: { value: currentValue } },
        );

        await waitFor(() => {
            const view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 100 }, { id: 110 }, { id: 120 }, { id: 121 }, { id: 122 }, { id: 200 }, { id: 300 }, { id: 310 }, { id: 320 }, { id: 330 },
            ]);
        });

        let view = hookResult.result.current;
        let listProps = view.getListProps();
        expect(listProps.rowsCount).toEqual(10);

        // fold row #120
        let rows = view.getVisibleRows();
        await act(async () => {
            rows[2].onFold?.(rows[2]);
        });

        hookResult.rerender({ value: currentValue });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 100 }, { id: 110 }, { id: 120 }, { id: 200 }, { id: 300 }, { id: 310 }, { id: 320 }, { id: 330 },
            ]);
        });

        listProps = view.getListProps();
        expect(listProps.rowsCount).toEqual(8);

        // fold row #100
        rows = view.getVisibleRows();
        await act(async () => {
            rows[0].onFold?.(rows[0]);
        });

        hookResult.rerender({ value: currentValue });
        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 100 }, { id: 200 }, { id: 300 }, { id: 310 }, { id: 320 }, { id: 330 },
            ]);
        });

        listProps = view.getListProps();
        expect(listProps.rowsCount).toEqual(6);
    });

    it('should clear cache', async () => {
        const hookResult = renderHook(
            ({ value }) => treeDataSource.useView(value, onValueChanged, { isFoldedByDefault: () => false, backgroundReload: false }),
            { initialProps: { value: currentValue } },
        );

        await waitFor(() => {
            const view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 100 }, { id: 110 }, { id: 120 },
            ]);
        });

        treeDataSource.clearCache();

        hookResult.rerender({ value: currentValue });
        await waitFor(() => {
            const view = hookResult.result.current;
            expectViewToLookLike(view, [
                { isLoading: true }, { isLoading: true }, { isLoading: true },
            ]);
        });

        await waitFor(() => {
            const view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 100 }, { id: 110 }, { id: 120 },
            ]);
        });
    });

    it('load children lazily', async () => {
        const hookResult = renderHook(
            ({ value }) => treeDataSource.useView(value, onValueChanged, { isFoldedByDefault: () => false }),
            { initialProps: { value: currentValue } },
        );

        await waitFor(() => {
            const view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 100 }, { id: 110 }, { id: 120 },
            ]);
        });

        let view = hookResult.result.current;
        expect(view.getListProps().rowsCount).toBeGreaterThan(3);

        // Scroll down
        currentValue.topIndex = 2;
        hookResult.rerender({ value: currentValue });
        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 120 }, { isLoading: true }, { isLoading: true },
            ]);
        });

        expect(view.getListProps().rowsCount).toBeGreaterThan(4);

        hookResult.rerender({ value: currentValue });
        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 120 }, { id: 121 }, { id: 122 },
            ]);
        });
    });

    it('Checkboxes works', async () => {
        currentValue.visibleCount = 3;
        const hookResult = renderHook(
            ({ value }) => treeDataSource.useView(value, onValueChanged, {
                getRowOptions: () => ({ checkbox: { isVisible: true } }),
                isFoldedByDefault: () => false,
            }),
            { initialProps: { value: currentValue } },
        );

        await waitFor(() => {
            const view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 100 }, { id: 110, isChecked: false }, { id: 120 },
            ]);
        });

        let view = hookResult.result.current;
        let row110 = view.getVisibleRows()[1];
        await act(async () => {
            row110.onCheck?.(row110);
        });

        hookResult.rerender({ value: currentValue });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 100, isChecked: false }, { id: 110, isChecked: true }, { id: 120, isChecked: false },
            ]);
        });

        row110 = view.getVisibleRows()[1];
        await act(async () => {
            row110.onCheck?.(row110);
        });
        hookResult.rerender({ value: currentValue });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 100, isChecked: false }, { id: 110, isChecked: false }, { id: 120, isChecked: false },
            ]);
        });
    });

    it('should not update checkboxes if onValueChange is not updating them', async () => {
        const mockOnValueChanged = jest.fn().mockImplementation();

        const hookResult = renderHook(
            ({ value }) => treeDataSource.useView(value, mockOnValueChanged, {
                getRowOptions: () => ({ checkbox: { isVisible: true } }),
                isFoldedByDefault: () => false,
            }),
            { initialProps: { value: currentValue } },
        );

        await waitFor(() => {
            const view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 100, isChecked: false }, { id: 110, isChecked: false }, { id: 120, isChecked: false },
            ]);
        });

        let view = hookResult.result.current;
        const row110 = view.getVisibleRows()[1];

        await act(async () => {
            row110.onCheck?.(row110);
        });

        expect(mockOnValueChanged).toBeCalledTimes(1);

        hookResult.rerender({ value: currentValue });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 100, isChecked: false }, { id: 110, isChecked: false }, { id: 120, isChecked: false },
            ]);
        });

        hookResult.rerender({ value: { ...currentValue, checked: [row110.id] } });

        expect(mockOnValueChanged).toBeCalledTimes(1);

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 100, isChecked: false }, { id: 110, isChecked: true }, { id: 120, isChecked: false },
            ]);
        });
    });

    it('Adjust parent checkbox if children are checked', async () => {
        currentValue.visibleCount = 10;
        currentValue.checked = [
            121, 122, 310, 320,
        ];

        const hookResult = renderHook(
            ({ value }) => treeDataSource.useView(value, onValueChanged, {
                cascadeSelection: true,
                getRowOptions: () => ({ checkbox: { isVisible: true } }),
                isFoldedByDefault: () => false,
            }),
            { initialProps: { value: currentValue } },
        );

        await waitFor(() => {
            const view = hookResult.result.current;
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
    });

    it('CascadeSelection = false - Select All', async () => {
        currentValue.visibleCount = 2; // to check that Select All works even if not all rows are loaded
        currentValue.checked = [
            121, 122, 310, 320,
        ];

        const hookResult = renderHook(
            ({ value, onValueChange }) => treeDataSource.useView(value, onValueChange, {
                cascadeSelection: false,
                getRowOptions: () => ({ checkbox: { isVisible: true } }),
                isFoldedByDefault: () => false,
            }),
            { initialProps: { value: currentValue, onValueChange: onValueChanged } },
        );

        await waitFor(() => {
            const view = hookResult.result.current;
            expect(view.getListProps().selectAll?.value).toBe(false);
        });

        let view = hookResult.result.current;

        let selectAll = view.getListProps().selectAll;
        expect(selectAll?.indeterminate).toBe(true);

        await act(async () => {
            selectAll?.onValueChange(true);
        });

        currentValue.visibleCount = 10;
        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged });

        await waitFor(() => {
            view = hookResult.result.current;
            selectAll = view.getListProps().selectAll;
            expect(selectAll?.value).toBe(true);
        });

        selectAll = view.getListProps().selectAll;
        expect(selectAll?.indeterminate).toBe(false);

        await waitFor(() => {
            view = hookResult.result.current;

            expectViewToLookLike(
                view,
                [
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
                ],
            );
        });

        expect(view.getListProps().rowsCount).toBe(10);
        selectAll = view.getListProps().selectAll;
        expect(selectAll?.indeterminate).toBe(false);
        await act(async () => {
            selectAll?.onValueChange(false);
        });

        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged });

        await waitFor(() => {
            view = hookResult.result.current;
            selectAll = view.getListProps().selectAll;
            expect(selectAll?.value).toBe(false);
        });

        selectAll = view.getListProps().selectAll;
        expect(selectAll?.indeterminate).toBe(false);
        await waitFor(() => {
            view = hookResult.result.current;

            expectViewToLookLike(
                view,
                [
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
                ],
            );
        });

        expect(view.getListProps().rowsCount).toBe(10);
    });

    describe('CascadeSelection - false', () => {
        const initialValue: DataSourceState = { topIndex: 0, visibleCount: 5 };
        let updatedValue = { ...initialValue };
        const onValueChangeFn = (newValue: React.SetStateAction<DataSourceState<Record<string, any>, any>>) => {
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

        it('should clear specific unknown record', async () => {
            const unknownId = '-10000';
            updatedValue = { ...updatedValue, checked: [unknownId, 'BJ'] };

            const { dataSource: locationsDS } = getLazyLocationsDS({
                cascadeSelection: false,
                showSelectedOnly: true,
            });

            const hookResult = renderHook(
                ({ value, onValueChange, props }) => locationsDS.useView(value, onValueChange, props),
                { initialProps: {
                    value: updatedValue,
                    onValueChange: onValueChangeFn,
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

            await act(async () => {
                unknownRow.onCheck?.(unknownRow);
            });

            hookResult.rerender({ value: updatedValue, onValueChange: onValueChangeFn, props: {} });

            expect(updatedValue.checked).toEqual(['BJ']);
        });

        it('should clear unknown record via clearAll', async () => {
            const unknownId = '-10000';
            updatedValue = { ...updatedValue, checked: [unknownId, 'BJ'] };

            const { dataSource: locationsDS } = getLazyLocationsDS({
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
                    onValueChange: onValueChangeFn,
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

            await act(async () => {
                view.clearAllChecked();
            });

            hookResult.rerender({ value: updatedValue, onValueChange: onValueChangeFn, props: {} });

            await waitFor(() => {
                expect(updatedValue.checked).toEqual([]);
            });
        });
    });

    describe('CascadeSelection - explicit mode', () => {
        const initialValue: DataSourceState = { topIndex: 0, visibleCount: 5 };
        let updatedValue = { ...initialValue };
        const onValueChangeFn = (newValue: React.SetStateAction<DataSourceState<Record<string, any>, any>>) => {
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

        it('should clear specific unknown record', async () => {
            const unknownId = '-10000';
            updatedValue = { ...updatedValue, checked: [unknownId, 'BJ'] };

            const { dataSource: locationsDS } = getLazyLocationsDS({
                cascadeSelection: true,
                showSelectedOnly: true,
            });

            const hookResult = renderHook(
                ({ value, onValueChange, props }) => locationsDS.useView(value, onValueChange, props),
                { initialProps: {
                    value: updatedValue,
                    onValueChange: onValueChangeFn,
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

            await act(async () => {
                unknownRow.onCheck?.(unknownRow);
            });

            hookResult.rerender({ value: updatedValue, onValueChange: onValueChangeFn, props: {} });

            expect(updatedValue.checked).toEqual(['BJ']);
        });

        it('should clear unknown record via clearAll', async () => {
            const unknownId = '-10000';
            updatedValue = { ...updatedValue, checked: [unknownId, 'BJ'] };

            const { dataSource: locationsDS } = getLazyLocationsDS({
                cascadeSelection: true,
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
                    onValueChange: onValueChangeFn,
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

            await act(async () => {
                view.clearAllChecked();
            });

            hookResult.rerender({ value: updatedValue, onValueChange: onValueChangeFn, props: {} });

            await waitFor(() => {
                expect(updatedValue.checked).toEqual([]);
            });
        });

        it('Cascade selection works', async () => {
            currentValue.visibleCount = 6;
            const hookResult = renderHook(
                ({ value }) => treeDataSource.useView(value, onValueChanged, {
                    getRowOptions: () => ({ checkbox: { isVisible: true } }),
                    isFoldedByDefault: () => false,
                    cascadeSelection: true,
                }),
                { initialProps: { value: currentValue } },
            );

            await waitFor(() => {
                const view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 100 }, //  0   100
                    { id: 110, parentId: 100 }, //  1   110
                    { id: 120, parentId: 100, isChecked: false }, //  2     120
                    { id: 121, parentId: 120 }, //  3       121
                    { id: 122, parentId: 120 }, //  4       122
                    { id: 200 }, //  5   200
                ]);
            });

            let view = hookResult.result.current;
            let row120 = view.getVisibleRows()[2];

            await act(async () => {
                row120.onCheck?.(row120);
            });

            hookResult.rerender({ value: currentValue });

            await waitFor(() => {
                view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 100, isChecked: false, isChildrenChecked: true },
                    { id: 110, isChecked: false },
                    { id: 120, isChecked: true, isChildrenChecked: true },
                    { id: 121, isChecked: true },
                    { id: 122, isChecked: true },
                    { id: 200, isChecked: false },
                ]);
            });

            row120 = view.getVisibleRows()[2];
            await act(async () => {
                row120.onCheck?.(row120);
            });

            hookResult.rerender({ value: currentValue });
            await waitFor(() => {
                view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 100, isChecked: false, isChildrenChecked: false },
                    { id: 110, isChecked: false },
                    { id: 120, isChecked: false, isChildrenChecked: false },
                    { id: 121, isChecked: false },
                    { id: 122, isChecked: false },
                    { id: 200, isChecked: false },
                ]);
            });
        });

        it('Cascade selection - handles quick (simultaneous) clicks', async () => {
            currentValue.visibleCount = 10;

            const hookResult = renderHook(
                ({ value, onValueChange }) => treeDataSource.useView(value, onValueChange, {
                    getRowOptions: () => ({ checkbox: { isVisible: true } }),
                    isFoldedByDefault: () => false,
                    cascadeSelection: true,
                }),
                { initialProps: { value: currentValue, onValueChange: onValueChanged } },
            );

            await waitFor(() => {
                const view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 100 }, //  0   100
                    { id: 110, parentId: 100 }, //  1   110
                    { id: 120, parentId: 100, isChecked: false }, //  2     120
                    { id: 121, parentId: 120 }, //  3       121
                    { id: 122, parentId: 120 }, //  4       122
                    { id: 200 }, //  5   200
                    { id: 300 }, //  6   300
                    { id: 310, parentId: 300 }, //  7     310
                    { id: 320, parentId: 300 }, //  8     320
                    { id: 330, parentId: 300 }, //  9     330
                ]);
            });

            let view = hookResult.result.current;
            const row120 = view.getVisibleRows()[2];

            await act(async () => {
                row120.onCheck?.(row120);
            });

            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged });

            view = hookResult.result.current;
            const row300 = view.getVisibleRows()[6];
            expect(row300.id).toBe(300);

            await act(async () => {
                row300.onCheck?.(row300);
            });

            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged });

            await waitFor(() => {
                view = hookResult.result.current;

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
        });

        it('Select All', async () => {
            currentValue.visibleCount = 2; // to check that Select All works even if not all rows are loaded
            currentValue.checked = [
                121, 122, 310, 320,
            ];

            const hookResult = renderHook(
                ({ value, onValueChange }) => treeDataSource.useView(value, onValueChange, {
                    cascadeSelection: true,
                    getRowOptions: () => ({ checkbox: { isVisible: true } }),
                    isFoldedByDefault: () => false,
                }),
                { initialProps: { value: currentValue, onValueChange: onValueChanged } },
            );

            await waitFor(() => {
                const view = hookResult.result.current;
                expect(view.getListProps().selectAll?.value).toBe(false);
            });

            let view = hookResult.result.current;

            let selectAll = view.getListProps().selectAll;
            expect(selectAll?.indeterminate).toBe(true);

            await act(async () => {
                selectAll?.onValueChange(true);
            });

            currentValue.visibleCount = 10;
            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged });

            await waitFor(() => {
                view = hookResult.result.current;
                selectAll = view.getListProps().selectAll;
                expect(selectAll?.value).toBe(true);
            });

            selectAll = view.getListProps().selectAll;
            expect(selectAll?.indeterminate).toBe(false);

            await waitFor(() => {
                view = hookResult.result.current;

                expectViewToLookLike(
                    view,
                    [
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
                    ],
                );
            });

            expect(view.getListProps().rowsCount).toBe(10);
            selectAll = view.getListProps().selectAll;
            expect(selectAll?.indeterminate).toBe(false);
            await act(async () => {
                selectAll?.onValueChange(false);
            });

            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged });

            await waitFor(() => {
                view = hookResult.result.current;
                selectAll = view.getListProps().selectAll;
                expect(selectAll?.value).toBe(false);
            });

            selectAll = view.getListProps().selectAll;
            expect(selectAll?.indeterminate).toBe(false);
            await waitFor(() => {
                view = hookResult.result.current;

                expectViewToLookLike(
                    view,
                    [
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
                    ],
                );
            });

            expect(view.getListProps().rowsCount).toBe(10);
        });
    });

    describe('CascadeSelection - implicit mode', () => {
        const initialValue: DataSourceState = { topIndex: 0, visibleCount: 5 };
        let updatedValue = { ...initialValue };
        const onValueChangeFn = (newValue: React.SetStateAction<DataSourceState<Record<string, any>, any>>) => {
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

        it('should clear specific unknown record', async () => {
            const unknownId = '-10000';
            updatedValue = { ...updatedValue, checked: [unknownId, 'BJ'] };

            const { dataSource: locationsDS } = getLazyLocationsDS({
                cascadeSelection: 'implicit',
                showSelectedOnly: true,
            });

            const hookResult = renderHook(
                ({ value, onValueChange, props }) => locationsDS.useView(value, onValueChange, props),
                { initialProps: {
                    value: updatedValue,
                    onValueChange: onValueChangeFn,
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

            await act(async () => {
                unknownRow.onCheck?.(unknownRow);
            });

            hookResult.rerender({ value: updatedValue, onValueChange: onValueChangeFn, props: {} });

            expect(updatedValue.checked).toEqual(['BJ']);
        });

        it('should clear unknown record via clearAll', async () => {
            const unknownId = '-10000';
            updatedValue = { ...updatedValue, checked: [unknownId, 'BJ'] };

            const { dataSource: locationsDS } = getLazyLocationsDS({
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
                    onValueChange: onValueChangeFn,
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

            await act(async () => {
                view.clearAllChecked();
            });

            hookResult.rerender({ value: updatedValue, onValueChange: onValueChangeFn, props: {} });

            await waitFor(() => {
                expect(updatedValue.checked).toEqual([]);
            });
        });

        it('Cascade selection works', async () => {
            currentValue.visibleCount = 6;
            const hookResult = renderHook(
                ({ value, onValueChange }) => treeDataSource.useView(value, onValueChange, {
                    getRowOptions: () => ({ checkbox: { isVisible: true } }),
                    isFoldedByDefault: () => false,
                    cascadeSelection: 'implicit',
                }),
                { initialProps: { value: currentValue, onValueChange: onValueChanged } },
            );

            await waitFor(() => {
                const view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 100 }, //  0   100
                    { id: 110, parentId: 100 }, //  1   110
                    { id: 120, parentId: 100, isChecked: false }, //  2     120
                    { id: 121, parentId: 120 }, //  3       121
                    { id: 122, parentId: 120 }, //  4       122
                    { id: 200 }, //  5   200
                ]);
            });

            let view = hookResult.result.current;

            let row120 = view.getVisibleRows()[2];
            expect(row120.id).toBe(120);
            expect(row120.isChecked).toBe(false);

            await act(async () => {
                row120.onCheck?.(row120);
            });
            expect(currentValue.checked).toEqual([120]);

            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged });

            await waitFor(() => {
                view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 100, isChecked: false, isChildrenChecked: true },
                    { id: 110, isChecked: false },
                    { id: 120, isChecked: true, isChildrenChecked: true },
                    { id: 121, isChecked: true },
                    { id: 122, isChecked: true },
                    { id: 200, isChecked: false },
                ]);
            });

            expect(currentValue.checked).toEqual([120]);

            row120 = view.getVisibleRows()[2];
            await act(async () => {
                row120.onCheck?.(row120);
            });

            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged });

            await waitFor(() => {
                view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 100, isChecked: false, isChildrenChecked: false },
                    { id: 110, isChecked: false },
                    { id: 120, isChecked: false, isChildrenChecked: false },
                    { id: 121, isChecked: false },
                    { id: 122, isChecked: false },
                    { id: 200, isChecked: false },
                ]);
            });

            expect(currentValue.checked).toEqual([]);
        });

        it('Cascade selection - handles quick (simultaneous) clicks', async () => {
            currentValue.visibleCount = 10;

            const hookResult = renderHook(
                ({ value, onValueChange }) => treeDataSource.useView(value, onValueChange, {
                    getRowOptions: () => ({ checkbox: { isVisible: true } }),
                    isFoldedByDefault: () => false,
                    cascadeSelection: 'implicit',
                }),
                { initialProps: { value: currentValue, onValueChange: onValueChanged } },
            );

            await waitFor(() => {
                const view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 100 }, //  0   100
                    { id: 110, parentId: 100 }, //  1   110
                    { id: 120, parentId: 100, isChecked: false }, //  2     120
                    { id: 121, parentId: 120 }, //  3       121
                    { id: 122, parentId: 120 }, //  4       122
                    { id: 200 }, //  5   200
                    { id: 300 }, //  6   300
                    { id: 310, parentId: 300 }, //  7     310
                    { id: 320, parentId: 300 }, //  8     320
                    { id: 330, parentId: 300 }, //  9     330
                ]);
            });
            let view = hookResult.result.current;
            const row120 = view.getVisibleRows()[2];
            expect(row120.id).toBe(120);

            await act(async () => {
                row120.onCheck?.(row120);
            });

            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged });

            view = hookResult.result.current;
            const row300 = view.getVisibleRows()[6];
            expect(row300.id).toBe(300);

            await act(async () => {
                row300.onCheck?.(row300);
            });

            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged });

            await waitFor(() => {
                view = hookResult.result.current;
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

            expect(currentValue.checked).toEqual([120, 300]);
        });

        it('Select All', async () => {
            currentValue.visibleCount = 2; // to check that Select All works even if not all rows are loaded
            currentValue.checked = [
                121, 122, 310, 320,
            ];
            const hookResult = renderHook(
                ({ value, onValueChange }) => treeDataSource.useView(value, onValueChange, {
                    cascadeSelection: 'implicit',
                    getRowOptions: () => ({ checkbox: { isVisible: true } }),
                    isFoldedByDefault: () => false,
                }),
                { initialProps: { value: currentValue, onValueChange: onValueChanged } },
            );

            await waitFor(() => {
                const view = hookResult.result.current;
                const selectAll = view.getListProps().selectAll;
                expect(selectAll?.value).toBe(false);
            });

            let view = hookResult.result.current;
            let selectAll = view.getListProps().selectAll;
            expect(selectAll?.indeterminate).toBe(true);

            await act(async () => {
                selectAll?.onValueChange(true);
            });

            currentValue.visibleCount = 10;
            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged });

            await waitFor(() => {
                view = hookResult.result.current;
                selectAll = view.getListProps().selectAll;
                expect(selectAll?.value).toBe(true);
            });

            selectAll = view.getListProps().selectAll;
            expect(selectAll?.indeterminate).toBe(false);
            await waitFor(() => {
                view = hookResult.result.current;
                expectViewToLookLike(
                    view,
                    [
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
                    ],
                );
            });

            expect(view.getListProps().rowsCount).toBe(10);

            expect(currentValue.checked).toEqual([
                100, 200, 300,
            ]);

            view = hookResult.result.current;
            selectAll = view.getListProps().selectAll;
            await act(async () => {
                selectAll?.onValueChange(false);
            });

            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged });

            await waitFor(() => {
                view = hookResult.result.current;
                selectAll = view.getListProps().selectAll;
                expect(selectAll?.value).toBe(false);
            });

            selectAll = view.getListProps().selectAll;
            expect(selectAll?.indeterminate).toBe(false);

            await waitFor(() => {
                view = hookResult.result.current;
                // console.log(view.getVisibleRows());
                expectViewToLookLike(
                    view,
                    [
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
                    ],
                );
            });

            expect(view.getListProps().rowsCount).toBe(10);
        });
    });

    it('FocusedIndex works', async () => {
        currentValue.visibleCount = 3;

        const hookResult = renderHook(
            ({ value, onValueChange }) => treeDataSource.useView(value, onValueChange, {
                getRowOptions: () => ({ checkbox: { isVisible: true } }),
                isFoldedByDefault: () => false,
                cascadeSelection: true,
            }),
            { initialProps: { value: currentValue, onValueChange: onValueChanged } },
        );

        await waitFor(() => {
            const view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { id: 100, isFocused: false }, { id: 110, isFocused: false }, { id: 120, isFocused: false },
                ],
            );
        });

        let view = hookResult.result.current;

        currentValue.focusedIndex = 0;

        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { id: 100, isFocused: true }, { id: 110, isFocused: false }, { id: 120, isFocused: false },
                ],
            );
        });

        currentValue.focusedIndex = 2;

        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged });
        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { id: 100, isFocused: false }, { id: 110, isFocused: false }, { id: 120, isFocused: true },
                ],
            );
        });
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
            { initialProps: { value: currentValue, onValueChange: onValueChanged } },
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
        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged });

        await waitFor(() => {
            const view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
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
                ],
            );
        });

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

    it('Correctly fold inner children in hierarchy', async () => {
        const testDataLocal: TestItem[] = [
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

        testDataLocal.forEach((i) => {
            i.childrenCount = testDataLocal.filter((x) => x.parentId === i.id).length;
        });

        currentValue.visibleCount = 5;

        const testApiLocal = jest.fn((rq: LazyDataSourceApiRequest<TestItem, number, DataQueryFilter<TestItem>>) => Promise.resolve(runDataQuery(testDataLocal, rq)));

        const ds = new LazyDataSource({
            api: (rq, ctx) =>
                ctx?.parent
                    ? testApiLocal({ ...rq, filter: { ...rq.filter, parentId: ctx.parentId } })
                    : testApiLocal({ ...rq, filter: { ...rq.filter, parentId: { isNull: true } } }),
            getChildCount: (i) => i.childrenCount,
        });

        const hookResult = renderHook(
            ({ value, onValueChange }) => ds.useView(value, onValueChange, {
                cascadeSelection: true,
                getRowOptions: () => ({ checkbox: { isVisible: true } }),
                isFoldedByDefault: () => false,
                getParentId: (i) => i.parentId,
            }),
            { initialProps: { value: currentValue, onValueChange: onValueChanged } },
        );
        await waitFor(() => {
            const view = hookResult.result.current;
            const viewRows = view.getVisibleRows();

            const expectedRows = [
                { id: 100, isFolded: false },
                { id: 110, isFolded: false, parentId: 100 }, // we add a lot of row here, to prevent loading some rows on initial load
                { id: 111, isFolded: false, parentId: 110 },
                { id: 112, isFolded: false, parentId: 110 },
                { id: 113, isFolded: false, parentId: 110 },
            ];

            expect(viewRows).toEqual(expectedRows.map((r) => expect.objectContaining(r)));
        });

        let view = hookResult.result.current;
        // fold row #100
        let rows = view.getVisibleRows();

        await act(async () => {
            rows[0].onFold?.(rows[0]);
        });

        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged });

        await waitFor(() => {
            view = hookResult.result.current;
            rows = view.getVisibleRows();

            expect(rows).toEqual([
                { id: 100 }, { id: 200 }, { id: 300 }, { id: 400 }, { id: 500 },
            ].map((r) => expect.objectContaining(r)));
        });
    });

    it('should check/uncheck parents if all/no siblings checked', async () => {
        currentValue.visibleCount = 10;

        const hookResult = renderHook(
            ({ value, onValueChange }) => treeDataSource.useView(value, onValueChange, {
                getRowOptions: () => ({ checkbox: { isVisible: true } }),
                isFoldedByDefault: () => false,
                cascadeSelection: true,
            }),
            { initialProps: { value: currentValue, onValueChange: onValueChanged } },
        );

        await waitFor(() => {
            const view = hookResult.result.current;

            expectViewToLookLike(view, [
                { id: 100, isChildrenChecked: false, isFolded: false },
                { id: 110, isChildrenChecked: false, isFolded: false },
                { id: 120, isFolded: false },
                { id: 121, isFolded: false },
                { id: 122, isFolded: false },
                { id: 200, isFolded: false },
                { id: 300, isFolded: false },
                { id: 310, isFolded: false },
                { id: 320, isFolded: false },
                { id: 330, isFolded: false },
            ]);
        });

        let view = hookResult.result.current;
        let row121 = view.getVisibleRows()[3];

        await act(async () => {
            row121.onCheck?.(row121);
        });

        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged });
        view = hookResult.result.current;
        const row122 = view.getVisibleRows()[4];
        await act(async () => {
            row122.onCheck?.(row122);
        });

        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged });
        await waitFor(() => {
            view = hookResult.result.current;
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
        });

        view = hookResult.result.current;
        row121 = view.getVisibleRows()[3];
        await act(async () => {
            row121.onCheck?.(row121);
        });

        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged });
        await waitFor(() => {
            view = hookResult.result.current;
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
    });
});
