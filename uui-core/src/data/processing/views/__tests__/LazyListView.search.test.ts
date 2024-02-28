import { DataQueryFilter, DataRowProps, DataSourceState, IDataSourceView, LazyDataSourceApiRequest } from '../../../../types';
import { runDataQuery } from '../../../querying';
import { LazyDataSource } from '../../LazyDataSource';
import { act, renderHook, waitFor } from '@epam/uui-test-utils';
import { LocationItem, getLazyLocationsDS } from '../../__tests__/mocks';

interface TestItem {
    name: string;
    id: number;
    parentId?: number;
    childrenCount?: number;
}
describe('LazyListView - search', () => {
    function expectViewToLookLike(
        view: IDataSourceView<LocationItem, string, DataQueryFilter<LocationItem>>,
        rows: Partial<DataRowProps<LocationItem, string>>[],
    ) {
        const viewRows = view.getVisibleRows();
        expect(viewRows).toEqual(rows.map((r) => expect.objectContaining(r)));
    }

    describe('flattenSearchResults', () => {
        const testData: TestItem[] = [
            { id: 100, name: 'A1' }, { id: 110, name: 'AA2', parentId: 100 }, { id: 111, name: 'AA3', parentId: 110 }, { id: 112, name: 'AA4', parentId: 110 }, { id: 113, name: 'AA5', parentId: 110 }, { id: 114, name: 'AA6', parentId: 110 }, { id: 115, name: 'AA7', parentId: 110 }, { id: 116, name: 'AA8', parentId: 110 }, { id: 120, name: 'AB9', parentId: 100 }, { id: 121, name: 'ABC1', parentId: 120 }, { id: 122, name: 'ABC2', parentId: 120 }, { id: 123, name: 'ABC3', parentId: 120 }, { id: 124, name: 'ABC4', parentId: 120 }, { id: 125, name: 'ABC5', parentId: 120 }, { id: 200, name: 'B1' }, { id: 300, name: 'C1' }, { id: 400, name: 'D1' }, { id: 500, name: 'E1' }, { id: 600, name: 'F1' }, { id: 700, name: 'G1' }, { id: 800, name: 'H1' }, { id: 900, name: 'I1' },
        ];

        testData.forEach((i) => {
            i.childrenCount = testData.filter((x) => x.parentId === i.id).length;
        });

        let currentValue: DataSourceState = { visibleCount: 5 };
        const onValueChanged = (newValue: React.SetStateAction<DataSourceState<Record<string, any>, any>>) => {
            if (typeof newValue === 'function') {
                currentValue = newValue(currentValue);
                return;
            }
            currentValue = newValue;
        };

        const testApi = jest.fn((rq: LazyDataSourceApiRequest<TestItem, number, DataQueryFilter<TestItem>>) => Promise.resolve(runDataQuery(testData, rq)));
        const api = (rq, ctx) => {
            const search = ctx?.parentId ? undefined : rq.search;
            const filter = search ? { ...rq.filter } : { ...rq.filter, parentId: ctx?.parentId };
            return testApi({ ...rq, filter, search });
        };

        const ds = new LazyDataSource({ api, getChildCount: (i) => i.childrenCount ?? 0 });
        const viewProps = {
            flattenSearchResults: true,
            getRowOptions: () => ({ checkbox: { isVisible: true } }),
            isFoldedByDefault: () => false,
            getParentId: (i) => i.parentId,
            getId: (i) => i.id,
            api,
        };

        it('should search for nested children and build correct path, indent, depth, isLastChild', async () => {
            const hookResult = renderHook(
                ({ value, onValueChange, props }) => ds.useView(value, onValueChange, props),
                { initialProps: { value: currentValue, onValueChange: onValueChanged, props: viewProps } },
            );

            hookResult.rerender({ value: { search: 'ABC5', topIndex: 0, visibleCount: 20 }, onValueChange: onValueChanged, props: viewProps });

            await waitFor(() => {
                const view = hookResult.result.current;
                const rows = view.getVisibleRows();
                expect(rows).toEqual([
                    expect.objectContaining({
                        id: 125,
                        depth: 2,
                        indent: 0,
                        index: 0,
                        parentId: 120,
                        path: [
                            { id: 100, isLastChild: false, value: { childrenCount: 2, id: 100, name: 'A1' } }, {
                                id: 120,
                                isLastChild: false,
                                value: {
                                    childrenCount: 5, id: 120, name: 'AB9', parentId: 100,
                                },
                            },
                        ],
                        isLastChild: true,
                        value: {
                            childrenCount: 0, id: 125, name: 'ABC5', parentId: 120,
                        },
                    }),
                ]);
            });
            const view = hookResult.result.current;
            const rows = view.getVisibleRows();
            expect(rows).toHaveLength(1);
        });

        it('should detect if found item is last child in parent', async () => {
            const hookResult = renderHook(
                ({ value, onValueChange, props }) => ds.useView(value, onValueChange, props),
                { initialProps: { value: currentValue, onValueChange: onValueChanged, props: viewProps } },
            );

            hookResult.rerender({ value: { search: 'ABC', topIndex: 0, visibleCount: 20 }, onValueChange: onValueChanged, props: viewProps });
            await waitFor(() => {
                const view = hookResult.result.current;
                const rows = view.getVisibleRows();
                const path = [
                    { id: 100, isLastChild: false, value: { childrenCount: 2, id: 100, name: 'A1' } }, {
                        id: 120,
                        isLastChild: false,
                        value: {
                            childrenCount: 5, id: 120, name: 'AB9', parentId: 100,
                        },
                    },
                ];
                expect(rows).toEqual(
                    [
                        {
                            id: 121,
                            depth: 2,
                            indent: 0,
                            index: 0,
                            parentId: 120,
                            path,
                            isLastChild: false,
                            value: {
                                childrenCount: 0, id: 121, name: 'ABC1', parentId: 120,
                            },
                        }, {
                            id: 122,
                            depth: 2,
                            indent: 0,
                            index: 1,
                            parentId: 120,
                            path,
                            isLastChild: false,
                            value: {
                                childrenCount: 0, id: 122, name: 'ABC2', parentId: 120,
                            },
                        }, {
                            id: 123,
                            depth: 2,
                            indent: 0,
                            index: 2,
                            parentId: 120,
                            path,
                            isLastChild: false,
                            value: {
                                childrenCount: 0, id: 123, name: 'ABC3', parentId: 120,
                            },
                        }, {
                            id: 124,
                            depth: 2,
                            indent: 0,
                            index: 3,
                            parentId: 120,
                            path,
                            isLastChild: false,
                            value: {
                                childrenCount: 0, id: 124, name: 'ABC4', parentId: 120,
                            },
                        }, {
                            id: 125,
                            depth: 2,
                            indent: 0,
                            index: 4,
                            parentId: 120,
                            path,
                            isLastChild: true,
                            value: {
                                childrenCount: 0, id: 125, name: 'ABC5', parentId: 120,
                            },
                        },
                    ].map(expect.objectContaining),
                );
            });

            const view = hookResult.result.current;
            const rows = view.getVisibleRows();

            expect(rows).toHaveLength(5);
        });

        it('should work correctly with cascadeSelection = explicit', async () => {
            const { dataSource } = getLazyLocationsDS({
                flattenSearchResults: true,
                cascadeSelection: 'explicit',
                rowOptions: { checkbox: { isVisible: true } },
            });

            currentValue.visibleCount = 50;
            const hookResult = renderHook(
                ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                { initialProps: {
                    value: currentValue,
                    onValueChange: onValueChanged,
                    props: {},
                } },
            );

            await waitFor(() => {
                const view = hookResult.result.current;
                expect(view.getListProps().isReloading).toBeFalsy();
            });

            await waitFor(() => {
                const view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 'c-AF', parentId: undefined },
                    { id: 'c-EU', parentId: undefined },
                ]);
            });

            currentValue.search = 'Alge';
            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

            await waitFor(() => {
                const view = hookResult.result.current;
                expect(view.getListProps().isReloading).toBeFalsy();
            });

            await waitFor(() => {
                const view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 'DZ', parentId: 'c-AF' },
                ]);
            });

            let view = hookResult.result.current;
            let rows = view.getVisibleRows();
            const rowDZ = rows[0];
            await act(() => {
                rowDZ.onCheck?.(rowDZ);
            });

            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

            await waitFor(() => {
                view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 'DZ', parentId: 'c-AF', isChecked: true, isChildrenChecked: true },
                ]);
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

            currentValue.search = 'Afr';
            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

            await waitFor(() => {
                view = hookResult.result.current;
                expect(view.getListProps().isReloading).toBeFalsy();
            });

            await waitFor(() => {
                view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 'c-AF', isChecked: false, isChildrenChecked: true },
                ]);
            });

            currentValue.search = 'Zeralda';
            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

            await waitFor(() => {
                view = hookResult.result.current;
                expect(view.getListProps().isReloading).toBeFalsy();
            });

            await waitFor(() => {
                view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: '2474583', parentId: 'DZ', isChecked: true, isChildrenChecked: false },
                ]);
            });

            rows = view.getVisibleRows();
            const rowZeralda = rows[0];

            await act(() => {
                rowZeralda.onCheck?.(rowZeralda);
            });

            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

            await waitFor(() => {
                view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: '2474583', parentId: 'DZ', isChecked: false, isChildrenChecked: false },
                ]);
            });

            currentValue.search = 'Alge';
            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

            await waitFor(() => {
                view = hookResult.result.current;
                expect(view.getListProps().isReloading).toBeFalsy();
            });

            await waitFor(() => {
                view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 'DZ', parentId: 'c-AF', isChecked: false, isChildrenChecked: true },
                ]);
            });

            currentValue.search = 'Afr';
            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

            await waitFor(() => {
                view = hookResult.result.current;
                expect(view.getListProps().isReloading).toBeFalsy();
            });

            await waitFor(() => {
                view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 'c-AF', isChecked: false, isChildrenChecked: true },
                ]);
            });

            currentValue.search = 'Tlemcen';
            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

            await waitFor(() => {
                view = hookResult.result.current;
                expect(view.getListProps().isReloading).toBeFalsy();
            });

            await waitFor(() => {
                view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: '2475687', isChecked: true, isChildrenChecked: false },
                ]);
            });

            currentValue.search = '';
            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });
            await waitFor(() => {
                view = hookResult.result.current;
                expect(view.getListProps().isReloading).toBeFalsy();
            });

            await waitFor(() => {
                view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 'c-AF', parentId: undefined, isChecked: false, isChildrenChecked: true },
                    { id: 'c-EU', parentId: undefined },
                ]);
            });
        });
    });
});
