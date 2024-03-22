import { renderHook, waitFor } from '@epam/uui-test-utils';
import { DataQueryFilter, DataRowProps, DataSourceState, IDataSourceView } from '../../../../types';
import { LocationItem, getArrayLocationsDS } from '../../__tests__/mocks';
import { ItemsMap } from '../tree/ItemsMap';
import { act } from 'react-dom/test-utils';
import { PatchOrderingTypes } from '../tree';
import { ArrayListViewProps } from '../types';

describe('ArrayListView - patch items', () => {
    let currentValue: DataSourceState<DataQueryFilter<LocationItem>, string>;
    const onValueChanged = (newValue: React.SetStateAction<DataSourceState<DataQueryFilter<LocationItem>, string>>) => {
        if (typeof newValue === 'function') {
            currentValue = newValue(currentValue);
            return;
        }
        currentValue = newValue;
    };
    beforeEach(() => {
        jest.clearAllMocks();
        currentValue = { topIndex: 0, visibleCount: 3 };
    });

    function expectViewToLookLike(
        view: IDataSourceView<LocationItem, string, DataQueryFilter<LocationItem>>,
        rows: Partial<DataRowProps<LocationItem, string>>[],
    ) {
        const viewRows = view.getVisibleRows();
        expect(viewRows).toEqual(rows.map((r) => expect.objectContaining(r)));
    }

    function createItemsMap(itemsObj: Record<string, LocationItem>) {
        return ItemsMap.fromObject<string, LocationItem>(itemsObj, { getId: ({ id }) => id });
    }

    it.each([
        undefined,
        () => PatchOrderingTypes.TOP,
    ])
    ('should add items to the beginning of the list if item is not in list', async (getNewItemPosition) => {
        const dataSource = getArrayLocationsDS({
            patchItems: createItemsMap({
                AS: {
                    id: 'c-AS',
                    name: 'Asia',
                    type: 'continent',
                    __typename: 'Location',
                    childCount: 0,
                },
                AN: {
                    id: 'c-AN',
                    name: 'Antarctica',
                    type: 'continent',
                    __typename: 'Location',
                    childCount: 0,
                },
                NA: {
                    id: 'c-NA',
                    name: 'North America',
                    type: 'continent',
                    __typename: 'Location',
                    childCount: 0,
                },
            }),

            getNewItemPosition,
        });

        currentValue.visibleCount = 5;
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
            expectViewToLookLike(view, [
                { id: 'c-NA' },
                { id: 'c-AN' },
                { id: 'c-AS' },
                { id: 'c-AF' },
                { id: 'c-EU' },
            ]);
        });

        const view = hookResult.result.current;
        expect(view.getListProps().rowsCount).toEqual(5);
    });

    it('should add items to the end of the list if item is not in list and position is BOTTOM', async () => {
        const dataSource = getArrayLocationsDS({
            patchItems: createItemsMap({
                AS: {
                    id: 'c-AS',
                    name: 'Asia',
                    type: 'continent',
                    __typename: 'Location',
                    childCount: 0,
                },
                AN: {
                    id: 'c-AN',
                    name: 'Antarctica',
                    type: 'continent',
                    __typename: 'Location',
                    childCount: 0,
                },
                NA: {
                    id: 'c-NA',
                    name: 'North America',
                    type: 'continent',
                    __typename: 'Location',
                    childCount: 0,
                },
            }),

            getNewItemPosition: () => PatchOrderingTypes.BOTTOM,
        });

        currentValue.visibleCount = 5;
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
            expectViewToLookLike(view, [
                { id: 'c-AF' },
                { id: 'c-EU' },
                { id: 'c-AS' },
                { id: 'c-AN' },
                { id: 'c-NA' },
            ]);
        });

        const view = hookResult.result.current;
        expect(view.getListProps().rowsCount).toEqual(5);
    });

    it.each([
        undefined,
        () => PatchOrderingTypes.TOP,
    ])('should add items to the top by parent', async (getNewItemPosition) => {
        const patchItems = createItemsMap({
            AS: {
                id: 'c-AS',
                name: 'Asia',
                type: 'continent',
                __typename: 'Location',
                parentId: 'c-AF',
                childCount: 0,
            },
            AN: {
                id: 'c-AN',
                name: 'Antarctica',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
            NA: {
                id: 'c-NA',
                name: 'North America',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
        });

        const dataSource = getArrayLocationsDS({});

        currentValue.visibleCount = 10;
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
            { initialProps: {
                value: currentValue,
                onValueChange: onValueChanged,
                props: {
                    patchItems, getNewItemPosition,
                },
            } },
        );

        await waitFor(() => {
            const view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 'c-AF' },
                { id: 'c-EU' },
            ]);
        });

        let view = hookResult.result.current;
        expect(view.getListProps().rowsCount).toEqual(2);

        const rowAF = view.getVisibleRows()[0];
        await act(() => {
            rowAF.onFold?.(rowAF);
        });

        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: { patchItems, getNewItemPosition } });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { id: 'c-AF' },
                    { id: 'c-NA', parentId: 'c-AF' },
                    { id: 'c-AN', parentId: 'c-AF' },
                    { id: 'c-AS', parentId: 'c-AF' },
                    { id: 'DZ', parentId: 'c-AF' },
                    { id: 'BJ', parentId: 'c-AF' },
                    { id: 'GM', parentId: 'c-AF' },
                    { id: 'c-EU' },
                ],
            );
        });
    });

    it('should add items to the bottom by parent', async () => {
        const getNewItemPosition = () => PatchOrderingTypes.BOTTOM;
        const patchItems = createItemsMap({
            AS: {
                id: 'c-AS',
                name: 'Asia',
                type: 'continent',
                __typename: 'Location',
                parentId: 'c-AF',
                childCount: 0,
            },
            AN: {
                id: 'c-AN',
                name: 'Antarctica',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
            NA: {
                id: 'c-NA',
                name: 'North America',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
        });

        const dataSource = getArrayLocationsDS({});

        currentValue.visibleCount = 10;
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
            { initialProps: {
                value: currentValue,
                onValueChange: onValueChanged,
                props: {
                    patchItems, getNewItemPosition,
                },
            } },
        );

        await waitFor(() => {
            const view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 'c-AF' },
                { id: 'c-EU' },
            ]);
        });

        let view = hookResult.result.current;
        expect(view.getListProps().rowsCount).toEqual(2);

        const rowAF = view.getVisibleRows()[0];
        await act(() => {
            rowAF.onFold?.(rowAF);
        });

        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: { patchItems, getNewItemPosition } });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { id: 'c-AF' },
                    { id: 'DZ', parentId: 'c-AF' },
                    { id: 'BJ', parentId: 'c-AF' },
                    { id: 'GM', parentId: 'c-AF' },
                    { id: 'c-AS', parentId: 'c-AF' },
                    { id: 'c-AN', parentId: 'c-AF' },
                    { id: 'c-NA', parentId: 'c-AF' },
                    { id: 'c-EU' },
                ],
            );
        });
    });

    it('should fix position of item from patch till the next sorting change', async () => {
        const getNewItemPosition = () => PatchOrderingTypes.TOP;
        const patchItems = createItemsMap({
            AS1: {
                id: 'c-AS1',
                name: 'Asia1',
                type: 'continent',
                __typename: 'Location',
                parentId: 'c-AF',
                childCount: 0,
            },
            AS2: {
                id: 'c-AS2',
                name: 'Asia2',
                type: 'continent',
                __typename: 'Location',
                parentId: 'c-AF',
                childCount: 0,
            },
            AS3: {
                id: 'c-AS3',
                name: 'Asia3',
                type: 'continent',
                __typename: 'Location',
                parentId: 'c-AF',
                childCount: 0,
            },
            AN1: {
                id: 'c-AN1',
                name: 'Antarctica1',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
            AN2: {
                id: 'c-AN2',
                name: 'Antarctica2',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
            AN3: {
                id: 'c-AN3',
                name: 'Antarctica3',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
            NA1: {
                id: 'c-NA1',
                name: 'North America1',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
            NA2: {
                id: 'c-NA2',
                name: 'North America2',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
            NA3: {
                id: 'c-NA3',
                name: 'North America3',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
        });
        const emptyPatchItems: ItemsMap<string, LocationItem> | undefined = undefined;

        const dataSource = getArrayLocationsDS({});

        currentValue.visibleCount = 10;
        currentValue.sorting = [{ field: 'name', direction: 'desc' }];
        const props: Partial<ArrayListViewProps<LocationItem, string, any>> = {
            patchItems: emptyPatchItems,
            getNewItemPosition,
        };

        const hookResult = renderHook(
            ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
            { initialProps: {
                value: currentValue,
                onValueChange: onValueChanged,
                props,
            } },
        );

        await waitFor(() => {
            const view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 'c-EU' },
                { id: 'c-AF' },
            ]);
        });

        let view = hookResult.result.current;
        expect(view.getListProps().rowsCount).toEqual(2);

        const rowAF = view.getVisibleRows()[1];
        await act(() => {
            rowAF.onFold?.(rowAF);
        });

        currentValue.visibleCount = 10;
        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: { patchItems: emptyPatchItems, getNewItemPosition } });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { id: 'c-EU' },
                    { id: 'c-AF' },
                    { id: 'GM', parentId: 'c-AF' },
                    { id: 'BJ', parentId: 'c-AF' },
                    { id: 'DZ', parentId: 'c-AF' },
                ],
            );
        });

        currentValue.visibleCount = 20;
        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: { patchItems, getNewItemPosition } });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { id: 'c-EU' },
                    { id: 'c-AF' },

                    { id: 'c-NA3', parentId: 'c-AF' },
                    { id: 'c-NA2', parentId: 'c-AF' },
                    { id: 'c-NA1', parentId: 'c-AF' },

                    { id: 'c-AN3', parentId: 'c-AF' },
                    { id: 'c-AN2', parentId: 'c-AF' },
                    { id: 'c-AN1', parentId: 'c-AF' },

                    { id: 'c-AS3', parentId: 'c-AF' },
                    { id: 'c-AS2', parentId: 'c-AF' },
                    { id: 'c-AS1', parentId: 'c-AF' },

                    { id: 'GM', parentId: 'c-AF' },
                    { id: 'BJ', parentId: 'c-AF' },
                    { id: 'DZ', parentId: 'c-AF' },
                ],
            );
        });
        const newPatchItems = createItemsMap({
            AS1: {
                id: 'c-AS1',
                name: 'XA1',
                type: 'continent',
                __typename: 'Location',
                parentId: 'c-AF',
                childCount: 0,
            },
            AS2: {
                id: 'c-AS2',
                name: 'XA2',
                type: 'continent',
                __typename: 'Location',
                parentId: 'c-AF',
                childCount: 0,
            },
            AS3: {
                id: 'c-AS3',
                name: 'XA3',
                type: 'continent',
                __typename: 'Location',
                parentId: 'c-AF',
                childCount: 0,
            },
            AN1: {
                id: 'c-AN1',
                name: 'BA1',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
            AN2: {
                id: 'c-AN2',
                name: 'BA2',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
            AN3: {
                id: 'c-AN3',
                name: 'BA3',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
            NA1: {
                id: 'c-NA1',
                name: 'DA1',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
            NA2: {
                id: 'c-NA2',
                name: 'DA2',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
            NA3: {
                id: 'c-NA3',
                name: 'DA3',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
        });

        hookResult.rerender({
            value: currentValue,
            onValueChange: onValueChanged,
            props: {
                patchItems: newPatchItems,
                getNewItemPosition,
            },
        });

        await waitFor(() => {
            view = hookResult.result.current;
            // console.log(view.getVisibleRows());
            expectViewToLookLike(
                view,
                [
                    { id: 'c-EU' },
                    { id: 'c-AF' },
                    {
                        id: 'c-NA3',
                        parentId: 'c-AF',
                        value: {
                            id: 'c-NA3',
                            name: 'DA3',
                            type: 'continent',
                            parentId: 'c-AF',
                            __typename: 'Location',
                            childCount: 0,
                        },
                    },
                    {
                        id: 'c-NA2',
                        parentId: 'c-AF',
                        value: {
                            id: 'c-NA2',
                            name: 'DA2',
                            type: 'continent',
                            parentId: 'c-AF',
                            __typename: 'Location',
                            childCount: 0,
                        },
                    },
                    {
                        id: 'c-NA1',
                        parentId: 'c-AF',
                        value: {
                            id: 'c-NA1',
                            name: 'DA1',
                            type: 'continent',
                            parentId: 'c-AF',
                            __typename: 'Location',
                            childCount: 0,
                        },
                    },
                    {
                        id: 'c-AN3',
                        parentId: 'c-AF',
                        value: {
                            id: 'c-AN3',
                            name: 'BA3',
                            type: 'continent',
                            parentId: 'c-AF',
                            __typename: 'Location',
                            childCount: 0,
                        },
                    },
                    {
                        id: 'c-AN2',
                        parentId: 'c-AF',
                        value: {
                            id: 'c-AN2',
                            name: 'BA2',
                            type: 'continent',
                            parentId: 'c-AF',
                            __typename: 'Location',
                            childCount: 0,
                        },
                    },
                    {
                        id: 'c-AN1',
                        parentId: 'c-AF',
                        value: {
                            id: 'c-AN1',
                            name: 'BA1',
                            type: 'continent',
                            parentId: 'c-AF',
                            __typename: 'Location',
                            childCount: 0,
                        },
                    },
                    {
                        id: 'c-AS3',
                        parentId: 'c-AF',
                        value: {
                            id: 'c-AS3',
                            name: 'XA3',
                            type: 'continent',
                            __typename: 'Location',
                            parentId: 'c-AF',
                            childCount: 0,
                        },
                    },
                    {
                        id: 'c-AS2',
                        parentId: 'c-AF',
                        value: {
                            id: 'c-AS2',
                            name: 'XA2',
                            type: 'continent',
                            __typename: 'Location',
                            parentId: 'c-AF',
                            childCount: 0,
                        },
                    },
                    {
                        id: 'c-AS1',
                        parentId: 'c-AF',
                        value: {
                            id: 'c-AS1',
                            name: 'XA1',
                            type: 'continent',
                            __typename: 'Location',
                            parentId: 'c-AF',
                            childCount: 0,
                        },
                    },
                    { id: 'GM', parentId: 'c-AF' },
                    { id: 'BJ', parentId: 'c-AF' },
                    { id: 'DZ', parentId: 'c-AF' },
                ],
            );
        });

        currentValue.sorting = [{ field: 'name', direction: 'asc' }];
        hookResult.rerender({
            value: currentValue,
            onValueChange: onValueChanged,
            props: {
                patchItems: newPatchItems,
                getNewItemPosition,
            },
        });

        await waitFor(() => {
            view = hookResult.result.current;
            // console.log(view.getVisibleRows().map((value) => value?.value?.name));
            expectViewToLookLike(
                view,
                [
                    { id: 'c-AF' },
                    { id: 'DZ', parentId: 'c-AF' },
                    {
                        id: 'c-AN1',
                        parentId: 'c-AF',
                        value: {
                            id: 'c-AN1',
                            name: 'BA1',
                            type: 'continent',
                            parentId: 'c-AF',
                            __typename: 'Location',
                            childCount: 0,
                        },
                    },
                    {
                        id: 'c-AN2',
                        parentId: 'c-AF',
                        value: {
                            id: 'c-AN2',
                            name: 'BA2',
                            type: 'continent',
                            parentId: 'c-AF',
                            __typename: 'Location',
                            childCount: 0,
                        },
                    },
                    {
                        id: 'c-AN3',
                        parentId: 'c-AF',
                        value: {
                            id: 'c-AN3',
                            name: 'BA3',
                            type: 'continent',
                            parentId: 'c-AF',
                            __typename: 'Location',
                            childCount: 0,
                        },
                    },
                    { id: 'BJ', parentId: 'c-AF' },
                    {
                        id: 'c-NA1',
                        parentId: 'c-AF',
                        value: {
                            id: 'c-NA1',
                            name: 'DA1',
                            type: 'continent',
                            parentId: 'c-AF',
                            __typename: 'Location',
                            childCount: 0,
                        },
                    },

                    {
                        id: 'c-NA2',
                        parentId: 'c-AF',
                        value: {
                            id: 'c-NA2',
                            name: 'DA2',
                            type: 'continent',
                            parentId: 'c-AF',
                            __typename: 'Location',
                            childCount: 0,
                        },
                    },
                    {
                        id: 'c-NA3',
                        parentId: 'c-AF',
                        value: {
                            id: 'c-NA3',
                            name: 'DA3',
                            type: 'continent',
                            parentId: 'c-AF',
                            __typename: 'Location',
                            childCount: 0,
                        },
                    },
                    { id: 'GM', parentId: 'c-AF' },
                    {
                        id: 'c-AS1',
                        parentId: 'c-AF',
                        value: {
                            id: 'c-AS1',
                            name: 'XA1',
                            type: 'continent',
                            __typename: 'Location',
                            parentId: 'c-AF',
                            childCount: 0,
                        },
                    },
                    {
                        id: 'c-AS2',
                        parentId: 'c-AF',
                        value: {
                            id: 'c-AS2',
                            name: 'XA2',
                            type: 'continent',
                            __typename: 'Location',
                            parentId: 'c-AF',
                            childCount: 0,
                        },
                    },
                    {
                        id: 'c-AS3',
                        parentId: 'c-AF',
                        value: {
                            id: 'c-AS3',
                            name: 'XA3',
                            type: 'continent',
                            __typename: 'Location',
                            parentId: 'c-AF',
                            childCount: 0,
                        },
                    },
                    { id: 'c-EU' },
                ],
            );
        });
    });

    // it('should add items by parent', async () => {
    //     const dataSource = getArrayLocationsDS({
    //         patchItems: createItemsMap({
    //             YT: {
    //                 id: 'YT',
    //                 name: 'Mayotte',
    //                 parentId: 'c-AF',
    //                 type: 'country',
    //                 __typename: 'Location',
    //                 childCount: 0,
    //             } }),
    //         getPosition: () => 'bottom',
    //     });

    //     currentValue.visibleCount = 6;
    //     const hookResult = renderHook(
    //         ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
    //         { initialProps: {
    //             value: currentValue,
    //             onValueChange: onValueChanged,
    //             props: {},
    //         } },
    //     );

    //     await waitFor(() => {
    //         const view = hookResult.result.current;
    //         expect(view.getListProps().isReloading).toBeFalsy();
    //     }, { timeout: 300 });

    //     await waitFor(() => {
    //         const view = hookResult.result.current;
    //         expectViewToLookLike(view, [
    //             { id: 'c-AF' },
    //             { id: 'c-EU' },
    //         ]);
    //     });

    //     let view = hookResult.result.current;
    //     const rows = view.getVisibleRows();
    //     const rowAF = rows[0];
    //     await act(() => {
    //         rowAF.onFold?.(rowAF);
    //     });

    //     hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

    //     await waitFor(() => {
    //         view = hookResult.result.current;
    //         expectViewToLookLike(
    //             view,
    //             [
    //                 { id: 'c-AF' },
    //                 { id: 'DZ', parentId: 'c-AF' },
    //                 { id: 'BJ', parentId: 'c-AF' },
    //                 { id: 'GM', parentId: 'c-AF' },
    //                 { id: 'YT', parentId: 'c-AF' },
    //                 { id: 'c-EU' },
    //             ],
    //         );
    //     });
    // });

    // it('should add items by parent after some item', async () => {
    //     const dataSource = getArrayLocationsDS({
    //         patchItems: createItemsMap({
    //             YT: {
    //                 id: 'YT',
    //                 name: 'Mayotte',
    //                 parentId: 'c-AF',
    //                 type: 'country',
    //                 __typename: 'Location',
    //                 childCount: 0,
    //             } }),
    //         getPosition: () => ({ after: 'DZ' }),
    //     });

    //     currentValue.visibleCount = 6;
    //     const hookResult = renderHook(
    //         ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
    //         { initialProps: {
    //             value: currentValue,
    //             onValueChange: onValueChanged,
    //             props: {},
    //         } },
    //     );

    //     await waitFor(() => {
    //         const view = hookResult.result.current;
    //         expectViewToLookLike(view, [
    //             { id: 'c-AF' },
    //             { id: 'c-EU' },
    //         ]);
    //     });

    //     let view = hookResult.result.current;
    //     const rows = view.getVisibleRows();
    //     const rowAF = rows[0];
    //     await act(() => {
    //         rowAF.onFold?.(rowAF);
    //     });

    //     hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

    //     await waitFor(() => {
    //         view = hookResult.result.current;
    //         expectViewToLookLike(
    //             view,
    //             [
    //                 { id: 'c-AF' },
    //                 { id: 'DZ', parentId: 'c-AF' },
    //                 { id: 'YT', parentId: 'c-AF' },
    //                 { id: 'BJ', parentId: 'c-AF' },
    //                 { id: 'GM', parentId: 'c-AF' },
    //                 { id: 'c-EU' },
    //             ],
    //         );
    //     }, { timeout: 300 });
    // });
});
