import { renderHook, waitFor } from '@epam/uui-test-utils';
import { DataQueryFilter, DataRowProps, DataSourceState, IDataSourceView } from '../../../../types';
import { LocationItem, getLazyLocationsDS } from '../../__tests__/mocks';
import { ItemsMap } from '../tree/ItemsMap';
import { act } from 'react-dom/test-utils';
import { PatchOrdering } from '../tree';
import { LazyListViewProps } from '../types';

type ExtendedLocationItem = LocationItem & { isDeleted?: boolean };

describe('LazyListView - patch items', () => {
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

    function createItemsMap(itemsObj: Record<string, LocationItem | ExtendedLocationItem>) {
        return ItemsMap.fromObject<string, LocationItem | ExtendedLocationItem>(itemsObj, { getId: ({ id }) => id });
    }

    it.each([
        undefined,
        () => PatchOrdering.TOP,
    ])
    ('should add items to the beginning of the list if item is not in list', async (getNewItemPosition) => {
        const { dataSource } = getLazyLocationsDS({
            patch: createItemsMap({
                'c-AS': {
                    id: 'c-AS',
                    name: 'Asia',
                    type: 'continent',
                    __typename: 'Location',
                    childCount: 0,
                },
                'c-AN': {
                    id: 'c-AN',
                    name: 'Antarctica',
                    type: 'continent',
                    __typename: 'Location',
                    childCount: 0,
                },
                'c-NA': {
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
        const { dataSource } = getLazyLocationsDS({
            patch: createItemsMap({
                'c-AS': {
                    id: 'c-AS',
                    name: 'Asia',
                    type: 'continent',
                    __typename: 'Location',
                    childCount: 0,
                },
                'c-AN': {
                    id: 'c-AN',
                    name: 'Antarctica',
                    type: 'continent',
                    __typename: 'Location',
                    childCount: 0,
                },
                'c-NA': {
                    id: 'c-NA',
                    name: 'North America',
                    type: 'continent',
                    __typename: 'Location',
                    childCount: 0,
                },
            }),

            getNewItemPosition: () => PatchOrdering.BOTTOM,
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
        () => PatchOrdering.TOP,
    ])('should add items to the top by parent', async (getNewItemPosition) => {
        const patch = createItemsMap({
            'c-AS': {
                id: 'c-AS',
                name: 'Asia',
                type: 'continent',
                __typename: 'Location',
                parentId: 'c-AF',
                childCount: 0,
            },
            'c-AN': {
                id: 'c-AN',
                name: 'Antarctica',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
            'c-NA': {
                id: 'c-NA',
                name: 'North America',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
        });

        const { dataSource } = getLazyLocationsDS({});

        currentValue.visibleCount = 10;
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
            { initialProps: {
                value: currentValue,
                onValueChange: onValueChanged,
                props: {
                    patch, getNewItemPosition,
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

        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: { patch, getNewItemPosition } });

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
        const getNewItemPosition = () => PatchOrdering.BOTTOM;
        const patch = createItemsMap({
            'c-AS': {
                id: 'c-AS',
                name: 'Asia',
                type: 'continent',
                __typename: 'Location',
                parentId: 'c-AF',
                childCount: 0,
            },
            'c-AN': {
                id: 'c-AN',
                name: 'Antarctica',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
            'c-NA': {
                id: 'c-NA',
                name: 'North America',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
        });

        const { dataSource } = getLazyLocationsDS({});

        currentValue.visibleCount = 10;
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
            { initialProps: {
                value: currentValue,
                onValueChange: onValueChanged,
                props: {
                    patch, getNewItemPosition,
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

        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: { patch, getNewItemPosition } });

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

    it('should fix position of item from patch till the next sorting change and apply sorting after sorting change', async () => {
        const getNewItemPosition = () => PatchOrdering.TOP;
        const patch = createItemsMap({
            'c-AS1': {
                id: 'c-AS1',
                name: 'Asia1',
                type: 'continent',
                __typename: 'Location',
                parentId: 'c-AF',
                childCount: 0,
            },
            'c-AS2': {
                id: 'c-AS2',
                name: 'Asia2',
                type: 'continent',
                __typename: 'Location',
                parentId: 'c-AF',
                childCount: 0,
            },
            'c-AS3': {
                id: 'c-AS3',
                name: 'Asia3',
                type: 'continent',
                __typename: 'Location',
                parentId: 'c-AF',
                childCount: 0,
            },
            'c-AN1': {
                id: 'c-AN1',
                name: 'Antarctica1',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
            'c-AN2': {
                id: 'c-AN2',
                name: 'Antarctica2',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
            'c-AN3': {
                id: 'c-AN3',
                name: 'Antarctica3',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
            'c-NA1': {
                id: 'c-NA1',
                name: 'North America1',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
            'c-NA2': {
                id: 'c-NA2',
                name: 'North America2',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
            'c-NA3': {
                id: 'c-NA3',
                name: 'North America3',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
        });
        const emptyPatch: ItemsMap<string, LocationItem> | undefined = undefined;

        const { dataSource } = getLazyLocationsDS({});

        currentValue.visibleCount = 10;
        currentValue.sorting = [{ field: 'name', direction: 'desc' }];
        const props: Partial<LazyListViewProps<LocationItem, string, any>> = {
            patch: emptyPatch,
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
        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: { patch: emptyPatch, getNewItemPosition } });

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
        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: { patch, getNewItemPosition } });

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
        const newPatch = createItemsMap({
            'c-AS1': {
                id: 'c-AS1',
                name: 'XA1',
                type: 'continent',
                __typename: 'Location',
                parentId: 'c-AF',
                childCount: 0,
            },
            'c-AS2': {
                id: 'c-AS2',
                name: 'XA2',
                type: 'continent',
                __typename: 'Location',
                parentId: 'c-AF',
                childCount: 0,
            },
            'c-AS3': {
                id: 'c-AS3',
                name: 'XA3',
                type: 'continent',
                __typename: 'Location',
                parentId: 'c-AF',
                childCount: 0,
            },
            'c-AN1': {
                id: 'c-AN1',
                name: 'BA1',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
            'c-AN2': {
                id: 'c-AN2',
                name: 'BA2',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
            'c-AN3': {
                id: 'c-AN3',
                name: 'BA3',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
            'c-NA1': {
                id: 'c-NA1',
                name: 'DA1',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
            'c-NA2': {
                id: 'c-NA2',
                name: 'DA2',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
            'c-NA3': {
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
                patch: newPatch,
                getNewItemPosition,
            },
        });

        await waitFor(() => {
            view = hookResult.result.current;
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
                patch: newPatch,
                getNewItemPosition,
            },
        });

        await waitFor(() => {
            view = hookResult.result.current;
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

    it('should delete items from tree', async () => {
        const getNewItemPosition = () => PatchOrdering.TOP;
        const patch = createItemsMap({
            'c-AS1': {
                id: 'c-AS1',
                name: 'Asia1',
                type: 'continent',
                __typename: 'Location',
                parentId: 'c-AF',
                childCount: 0,
                isDeleted: true,
            },
            'c-NA1': {
                id: 'c-NA1',
                name: 'North America1',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
            'c-EU': {
                id: 'c-EU',
                type: 'continent',
                name: 'Europe',
                __typename: 'Location',
                childCount: 1,
                isDeleted: true,
            },
            GM: {
                id: 'GM',
                name: 'Gambia',
                type: 'country',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 6,
                isDeleted: true,
            },
            BJ: {
                id: 'BJ',
                name: 'Benin',
                type: 'country',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 10,
            },
        });

        const emptyPatch: ItemsMap<string, ExtendedLocationItem> | undefined = undefined;
        const { dataSource } = getLazyLocationsDS({});

        currentValue.visibleCount = 10;
        currentValue.sorting = [{ field: 'name', direction: 'desc' }];
        const props: Partial<LazyListViewProps<ExtendedLocationItem, string, any>> = {
            patch: emptyPatch,
            getNewItemPosition,
            isDeleted: (item) => item.isDeleted ?? false,
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
        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: { ...props, patch: emptyPatch } });

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

        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: { ...props, patch } });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    // { id: 'c-EU' },
                    { id: 'c-AF' },
                    { id: 'c-NA1', parentId: 'c-AF' },
                    // { id: 'c-AS1', parentId: 'c-AF' },
                    // { id: 'GM', parentId: 'c-AF' },
                    { id: 'BJ', parentId: 'c-AF' },
                    { id: 'DZ', parentId: 'c-AF' },
                ],
            );
        });
    });

    it('should update items', async () => {
        const getNewItemPosition = () => PatchOrdering.TOP;
        const patch = createItemsMap({
            'c-AS1': {
                id: 'c-AS1',
                name: 'Asia1',
                type: 'continent',
                __typename: 'Location',
                parentId: 'c-AF',
                childCount: 0,
            },
            'c-NA1': {
                id: 'c-NA1',
                name: 'North America1',
                type: 'continent',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 0,
            },
            'c-EU': {
                id: 'c-EU',
                type: 'continent',
                name: 'Europe',
                __typename: 'Location',
                childCount: 1,
            },
            GM: {
                id: 'GM',
                name: 'Gambia',
                type: 'country',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 6,
            },
            BJ: {
                id: 'BJ',
                name: 'Benin',
                type: 'country',
                parentId: 'c-AF',
                __typename: 'Location',
                childCount: 10,
            },
        });

        const emptyPatch: ItemsMap<string, ExtendedLocationItem> | undefined = undefined;
        const { dataSource } = getLazyLocationsDS({});

        currentValue.visibleCount = 10;
        currentValue.sorting = [{ field: 'name', direction: 'desc' }];
        const props: Partial<LazyListViewProps<ExtendedLocationItem, string, any>> = {
            patch: emptyPatch,
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
        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: { ...props, patch: emptyPatch } });

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

        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: { ...props, patch } });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { id: 'c-EU' },
                    { id: 'c-AF' },
                    { id: 'c-NA1', parentId: 'c-AF' },
                    { id: 'c-AS1', parentId: 'c-AF' },
                    { id: 'GM', parentId: 'c-AF' },
                    { id: 'BJ', parentId: 'c-AF' },
                    { id: 'DZ', parentId: 'c-AF' },
                ],
            );
        });
    });

    it('should move items from parent to parent', async () => {
        const getNewItemPosition = () => PatchOrdering.TOP;
        const patch = createItemsMap({
            GM: {
                id: 'GM',
                name: 'Gambia',
                type: 'country',
                parentId: 'c-EU',
                __typename: 'Location',
                childCount: 6,
            },
            BJ: {
                id: 'BJ',
                name: 'Benin',
                type: 'country',
                parentId: 'c-EU',
                __typename: 'Location',
                childCount: 10,
            },
        });

        const emptyPatch: ItemsMap<string, ExtendedLocationItem> | undefined = undefined;
        const { dataSource } = getLazyLocationsDS({});

        currentValue.visibleCount = 10;
        currentValue.sorting = [{ field: 'name', direction: 'desc' }];
        const props: Partial<LazyListViewProps<ExtendedLocationItem, string, any>> = {
            patch: emptyPatch,
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
        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: { ...props, patch: emptyPatch } });

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

        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: { ...props, patch } });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { id: 'c-EU' },
                    { id: 'c-AF' },
                    { id: 'DZ', parentId: 'c-AF' },
                ],
            );
        });

        const rowEU = view.getVisibleRows()[0];
        await act(() => {
            rowEU.onFold?.(rowEU);
        });

        currentValue.visibleCount = 10;
        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: { ...props, patch } });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { id: 'c-EU' },
                    { id: 'BJ', parentId: 'c-EU' },
                    { id: 'GM', parentId: 'c-EU' },
                    { id: 'GB', parentId: 'c-EU' },

                    { id: 'c-AF' },
                    { id: 'DZ', parentId: 'c-AF' },
                ],
            );
        });
    });

    it('should add item to the end of the list and updated previous existing item', async () => {
        const { dataSource } = getLazyLocationsDS({
            patch: createItemsMap({
                'c-AN': {
                    id: 'c-AN',
                    name: 'Antarctica',
                    type: 'continent',
                    __typename: 'Location',
                    childCount: 0,
                },
            }),

            getNewItemPosition: () => PatchOrdering.BOTTOM,
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
                { id: 'c-AN' },
            ]);
        });

        let view = hookResult.result.current;
        expect(view.getListProps().rowsCount).toEqual(3);

        const updatedPatch = createItemsMap({
            'c-AN': {
                id: 'c-AN',
                name: 'Antarctica',
                type: 'continent',
                __typename: 'Location',
                childCount: 0,
            },
            'c-EU': {
                id: 'c-EU',
                name: 'EU',
                type: 'continent',
                __typename: 'Location',
                childCount: 0,
            },
        });

        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: { patch: updatedPatch } });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 'c-AF' },
                { id: 'c-EU',
                    value: {
                        id: 'c-EU',
                        name: 'EU',
                        type: 'continent',
                        __typename: 'Location',
                        childCount: 0,
                    },
                },
                { id: 'c-AN',
                    value: {
                        id: 'c-AN',
                        name: 'Antarctica',
                        type: 'continent',
                        __typename: 'Location',
                        childCount: 0,
                    },
                },
            ]);
        });
    });

    it('should remove updated item and add new to the bottom', async () => {
        const { dataSource } = getLazyLocationsDS({
            patch: createItemsMap({
                'c-AN': {
                    id: 'c-AN',
                    name: 'Antarctica',
                    type: 'continent',
                    __typename: 'Location',
                    childCount: 0,
                },
            }),

            getNewItemPosition: () => PatchOrdering.BOTTOM,
            isDeleted: (item: ExtendedLocationItem) => item.isDeleted ?? false,
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
                { id: 'c-AN' },
            ]);
        });

        let view = hookResult.result.current;
        expect(view.getListProps().rowsCount).toEqual(3);

        const updatedPatch = createItemsMap({
            'c-AN': {
                id: 'c-AN',
                name: 'Antarctica',
                type: 'continent',
                __typename: 'Location',
                childCount: 0,
            },
            'c-EU': {
                id: 'c-EU',
                name: 'EU',
                type: 'continent',
                __typename: 'Location',
                childCount: 0,
            },
        });

        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: { patch: updatedPatch } });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 'c-AF' },
                { id: 'c-EU',
                    value: {
                        id: 'c-EU',
                        name: 'EU',
                        type: 'continent',
                        __typename: 'Location',
                        childCount: 0,
                    },
                },
                { id: 'c-AN',
                    value: {
                        id: 'c-AN',
                        name: 'Antarctica',
                        type: 'continent',
                        __typename: 'Location',
                        childCount: 0,
                    },
                },
            ]);
        });

        const updatedPatchWithDeleted = createItemsMap({
            'c-AN': {
                id: 'c-AN',
                name: 'Antarctica',
                type: 'continent',
                __typename: 'Location',
                childCount: 0,
            },
            'c-EU': {
                id: 'c-EU',
                name: 'EU',
                type: 'continent',
                __typename: 'Location',
                childCount: 0,
                isDeleted: true,
            },
        });

        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: { patch: updatedPatchWithDeleted } });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 'c-AF' },
                { id: 'c-AN',
                    value: {
                        id: 'c-AN',
                        name: 'Antarctica',
                        type: 'continent',
                        __typename: 'Location',
                        childCount: 0,
                    },
                },
            ]);
        });
    });
});
