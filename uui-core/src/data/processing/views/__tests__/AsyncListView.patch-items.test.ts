import { renderHook, waitFor } from '@epam/uui-test-utils';
import { DataQueryFilter, DataRowProps, DataSourceState, IDataSourceView } from '../../../../types';
import { LocationItem, getAsyncLocationsDS } from '../../__tests__/mocks';
import { ItemsMap } from '../tree/ItemsMap';
import { act } from 'react-dom/test-utils';

describe('AsyncListView - patch items', () => {
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
        const viewRows = view.getRows();
        expect(viewRows).toEqual(rows.map((r) => expect.objectContaining(r)));
    }

    function createItemsMap(itemsObj: Record<string, LocationItem>) {
        return ItemsMap.fromObject<string, LocationItem>(itemsObj, { getId: ({ id }) => id });
    }

    it.each([undefined, () => 'initial'])
    ('should add items to the beginning of the list if position is initial and item is not in list', async (getPosition) => {
        const { dataSource } = getAsyncLocationsDS({
            patchItems: createItemsMap({
                AS: {
                    id: 'c-AS',
                    name: 'Asia',
                    type: 'continent',
                    __typename: 'Location',
                    childCount: 0,
                } }),
            getPosition,
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

        let view = hookResult.result.current;
        expectViewToLookLike(
            view,
            [
                { id: 'c-AS' },
                { isLoading: true },
                { isLoading: true },
                { isLoading: true },
                { isLoading: true },
            ],
        );

        await waitFor(() => {
            view = hookResult.result.current;
            expect(view.getListProps().isReloading).toBeFalsy();
        }, { timeout: 1000 });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 'c-AS' },
                { id: 'c-AF' },
                { id: 'c-EU' },
            ]);
        });

        expect(view.getListProps().rowsCount).toEqual(3);
    });

    it('should add items to the beginning of the list if position is top', async () => {
        const { dataSource } = getAsyncLocationsDS({
            patchItems: createItemsMap({
                AS: {
                    id: 'c-AS',
                    name: 'Asia',
                    type: 'continent',
                    __typename: 'Location',
                    childCount: 0,
                } }),
            getPosition: () => 'top',
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

        let view = hookResult.result.current;
        expectViewToLookLike(
            view,
            [
                { id: 'c-AS' },
                { isLoading: true },
                { isLoading: true },
                { isLoading: true },
                { isLoading: true },
            ],
        );

        await waitFor(() => {
            view = hookResult.result.current;
            expect(view.getListProps().isReloading).toBeFalsy();
        }, { timeout: 1000 });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 'c-AS' },
                { id: 'c-AF' },
                { id: 'c-EU' },
            ]);
        });

        expect(view.getListProps().rowsCount).toEqual(3);
    });

    it('should add items to the end of the list if bottom position is passed', async () => {
        const { dataSource } = getAsyncLocationsDS({
            patchItems: createItemsMap({
                AS: {
                    id: 'c-AS',
                    name: 'Asia',
                    type: 'continent',
                    __typename: 'Location',
                    childCount: 0,
                } }),
            getPosition: () => 'bottom',
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

        let view = hookResult.result.current;
        expectViewToLookLike(
            view,
            [
                { id: 'c-AS' },
                { isLoading: true },
                { isLoading: true },
                { isLoading: true },
                { isLoading: true },
            ],
        );

        await waitFor(() => {
            view = hookResult.result.current;
            expect(view.getListProps().isReloading).toBeFalsy();
        }, { timeout: 1000 });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 'c-AF' },
                { id: 'c-EU' },
                { id: 'c-AS' },
            ]);
        });

        expect(view.getListProps().rowsCount).toEqual(3);
    });

    it('should add items by parent', async () => {
        const { dataSource } = getAsyncLocationsDS({
            patchItems: createItemsMap({
                YT: {
                    id: 'YT',
                    name: 'Mayotte',
                    parentId: 'c-AF',
                    type: 'country',
                    __typename: 'Location',
                    childCount: 0,
                } }),
            getPosition: () => 'bottom',
        });

        currentValue.visibleCount = 6;
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
            { initialProps: {
                value: currentValue,
                onValueChange: onValueChanged,
                props: {},
            } },
        );

        let view = hookResult.result.current;
        expectViewToLookLike(
            view,
            [
                { isLoading: true },
                { isLoading: true },
                { isLoading: true },
                { isLoading: true },
                { isLoading: true },
                { isLoading: true },
            ],
        );

        await waitFor(() => {
            view = hookResult.result.current;
            expect(view.getListProps().isReloading).toBeFalsy();
        }, { timeout: 300 });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 'c-AF' },
                { id: 'c-EU' },
            ]);
        });

        const rows = view.getRows();
        const rowAF = rows[0];
        await act(() => {
            rowAF.onFold?.(rowAF);
        });

        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { id: 'c-AF' },
                    { id: 'DZ', parentId: 'c-AF' },
                    { id: 'BJ', parentId: 'c-AF' },
                    { id: 'GM', parentId: 'c-AF' },
                    { id: 'YT', parentId: 'c-AF' },
                    { id: 'c-EU' },
                ],
            );
        }, { timeout: 300 });
    });

    it('should add items by parent after some item', async () => {
        const { dataSource } = getAsyncLocationsDS({
            patchItems: createItemsMap({
                YT: {
                    id: 'YT',
                    name: 'Mayotte',
                    parentId: 'c-AF',
                    type: 'country',
                    __typename: 'Location',
                    childCount: 0,
                } }),
            getPosition: () => ({ after: 'DZ' }),
        });

        currentValue.visibleCount = 6;
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
            { initialProps: {
                value: currentValue,
                onValueChange: onValueChanged,
                props: {},
            } },
        );

        let view = hookResult.result.current;
        expectViewToLookLike(
            view,
            [
                { isLoading: true },
                { isLoading: true },
                { isLoading: true },
                { isLoading: true },
                { isLoading: true },
                { isLoading: true },
            ],
        );

        await waitFor(() => {
            view = hookResult.result.current;
            expect(view.getListProps().isReloading).toBeFalsy();
        }, { timeout: 300 });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 'c-AF' },
                { id: 'c-EU' },
            ]);
        });

        const rows = view.getRows();
        const rowAF = rows[0];
        await act(() => {
            rowAF.onFold?.(rowAF);
        });

        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { id: 'c-AF' },
                    { id: 'DZ', parentId: 'c-AF' },
                    { id: 'YT', parentId: 'c-AF' },
                    { id: 'BJ', parentId: 'c-AF' },
                    { id: 'GM', parentId: 'c-AF' },
                    { id: 'c-EU' },
                ],
            );
        }, { timeout: 300 });
    });
});
