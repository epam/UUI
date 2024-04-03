import { CascadeSelection, DataQueryFilter, DataRowProps, DataSourceState, IDataSourceView } from '../../../../types';
import { act, renderHook, waitFor } from '@epam/uui-test-utils';
import { LocationItem, getAsyncLocationsDS } from '../../__tests__/mocks';

describe('AsyncListView - search', () => {
    function expectViewToLookLike(
        view: IDataSourceView<LocationItem, string, DataQueryFilter<LocationItem>>,
        rows: Partial<DataRowProps<LocationItem, string>>[],
    ) {
        const viewRows = view.getVisibleRows();
        expect(viewRows).toEqual(rows.map((r) => expect.objectContaining(r)));
    }
    let currentValue: DataSourceState = { visibleCount: 5 };
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

    it('should show unfolded tree results', async () => {
        const { dataSource } = getAsyncLocationsDS({});

        currentValue.search = 'Zeral';

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
            ],
        );

        await waitFor(() => {
            view = hookResult.result.current;
            const listProps = view.getListProps();
            expect(listProps.isReloading).toBeFalsy();
        });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(
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
        const { dataSource } = getAsyncLocationsDS({
            cascadeSelection,
            rowOptions: { checkbox: { isVisible: true } },
        });

        currentValue.search = 'Zeral';
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
            ],
        );

        await waitFor(() => {
            view = hookResult.result.current;
            const listProps = view.getListProps();
            expect(listProps.isReloading).toBeFalsy();
        });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(
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
            expectViewToLookLike(
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
            expectViewToLookLike(
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
            expectViewToLookLike(
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
            expectViewToLookLike(
                view,
                [
                    { id: 'c-AF', isChecked: false, isChildrenChecked: true, isFolded: true, indent: 1, depth: 0 },
                    { id: 'c-EU', isChecked: false, isChildrenChecked: false, isFolded: true, indent: 1, depth: 0 },
                ],
            );
        });
    });

    it('should check all children for search results with cascadeSelection = implicit', async () => {
        const { dataSource } = getAsyncLocationsDS({
            cascadeSelection: 'implicit',
            rowOptions: { checkbox: { isVisible: true } },
        });

        currentValue.search = 'Zeral';
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
            ],
        );

        await waitFor(() => {
            view = hookResult.result.current;
            const listProps = view.getListProps();
            expect(listProps.isReloading).toBeFalsy();
        });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(
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
            expectViewToLookLike(
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
            expectViewToLookLike(
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
            expectViewToLookLike(
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
            expectViewToLookLike(
                view,
                [
                    { id: 'c-AF', isChecked: false, isChildrenChecked: true, isFolded: true, indent: 1, depth: 0 },
                    { id: 'c-EU', isChecked: false, isChildrenChecked: false, isFolded: true, indent: 1, depth: 0 },
                ],
            );
        });
    });

    it('should check all children for search results with cascadeSelection = false', async () => {
        const { dataSource } = getAsyncLocationsDS({
            cascadeSelection: false,
            rowOptions: { checkbox: { isVisible: true } },
        });

        currentValue.search = 'Zeral';
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
            ],
        );

        await waitFor(() => {
            view = hookResult.result.current;
            const listProps = view.getListProps();
            expect(listProps.isReloading).toBeFalsy();
        });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(
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
            expectViewToLookLike(
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
            expectViewToLookLike(
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
            expectViewToLookLike(
                view,
                [
                    { id: 'c-AF', isChecked: false, isChildrenChecked: true, isFolded: true, indent: 1, depth: 0 },
                    { id: 'c-EU', isChecked: false, isChildrenChecked: false, isFolded: true, indent: 1, depth: 0 },
                ],
            );
        });
    });
});
