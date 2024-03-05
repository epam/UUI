import { renderHook, waitFor } from '@epam/uui-test-utils';
import { DataQueryFilter, DataRowProps, DataSourceState, IDataSourceView } from '../../../../types';
import { LocationItem, getArrayLocationsDS } from '../../__tests__/mocks';
import { act } from 'react-dom/test-utils';

describe('ArrayListView - row options', () => {
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
    describe('rowOptions', () => {
        it('should not allow checking if checkbox is not configured at rowOptions', async () => {
            const dataSource = getArrayLocationsDS({
                rowOptions: {},
            });

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
                    { id: 'c-AF', parentId: undefined, isCheckable: false, onCheck: undefined },
                    { id: 'c-EU', parentId: undefined, isCheckable: false, onCheck: undefined },
                ]);
            });
        });

        it('should not allow checking if checkbox is not visible at rowOptions', async () => {
            const checkbox = { isVisible: false };
            const dataSource = getArrayLocationsDS({
                rowOptions: { checkbox },
            });

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
                    { id: 'c-AF', parentId: undefined, isCheckable: false, onCheck: undefined, checkbox },
                    { id: 'c-EU', parentId: undefined, isCheckable: false, onCheck: undefined, checkbox },
                ]);
            });
        });

        it('should not allow checking if checkbox is disabled at rowOptions', async () => {
            const checkbox = { isVisible: true, isDisabled: true };
            const dataSource = getArrayLocationsDS({
                rowOptions: { checkbox },
            });

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
                    { id: 'c-AF', parentId: undefined, isCheckable: false, onCheck: undefined, checkbox },
                    { id: 'c-EU', parentId: undefined, isCheckable: false, onCheck: undefined, checkbox },
                ]);
            });
        });

        it('should selectAll be null, if checkbox is not configured at rowOptions', async () => {
            const dataSource = getArrayLocationsDS({
                rowOptions: {},
            });

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
                    { id: 'c-AF', parentId: undefined, isCheckable: false, onCheck: undefined },
                    { id: 'c-EU', parentId: undefined, isCheckable: false, onCheck: undefined },
                ]);
            });

            const view = hookResult.result.current;
            expect(view.selectAll).toBeNull();
        });

        it('should selectAll be null, if checkbox is not visible at rowOptions', async () => {
            const checkbox = { isVisible: false };
            const dataSource = getArrayLocationsDS({
                rowOptions: { checkbox },
            });

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
                    { id: 'c-AF', parentId: undefined, isCheckable: false, onCheck: undefined, checkbox },
                    { id: 'c-EU', parentId: undefined, isCheckable: false, onCheck: undefined, checkbox },
                ]);
            });

            const view = hookResult.result.current;
            expect(view.selectAll).toBeNull();
        });

        it('should return selectAll, if checkbox is disabled at rowOptions', async () => {
            const checkbox = { isVisible: true, isDisabled: true };
            const dataSource = getArrayLocationsDS({
                rowOptions: { checkbox },
            });

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
                    { id: 'c-AF', parentId: undefined, isCheckable: false, onCheck: undefined, checkbox },
                    { id: 'c-EU', parentId: undefined, isCheckable: false, onCheck: undefined, checkbox },
                ]);
            });

            const view = hookResult.result.current;
            expect(view.selectAll).not.toBeNull();
            expect(view.selectAll!.value).toBeFalsy();
            expect(typeof view.selectAll!.onValueChange).toBe('function');
            expect(view.selectAll!.indeterminate).toBeUndefined();
        });

        it('should return indeterminate = false for selectAll, if checkbox is visible and disabled at rowOptions and some item is checked', async () => {
            const checkbox = { isVisible: true, isDisabled: true };
            const dataSource = getArrayLocationsDS({
                rowOptions: { checkbox },
            });

            currentValue.checked = ['BJ'];
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
                    { id: 'c-AF', parentId: undefined, isCheckable: false, isChecked: false, isChildrenChecked: true, onCheck: undefined, checkbox },
                    { id: 'c-EU', parentId: undefined, isCheckable: false, onCheck: undefined, checkbox },
                ]);
            });

            let view = hookResult.result.current;
            expect(view.selectAll).not.toBeNull();
            expect(view.selectAll!.value).toBeFalsy();
            expect(typeof view.selectAll!.onValueChange).toBe('function');
            expect(view.selectAll!.indeterminate).toBeFalsy();

            const afRow = view.getVisibleRows()[0];

            await act(() => {
                afRow.onFold?.(afRow);
            });

            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

            await waitFor(() => {
                view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 'c-AF', parentId: undefined, isCheckable: false, isChecked: false, isChildrenChecked: true, onCheck: undefined, checkbox },
                    { id: 'DZ', isChecked: false },
                    { id: 'BJ', isChecked: true },
                ]);
            });
        });

        it('should return indeterminate = true for selectAll, if checkbox is visible and enabled at rowOptions and some item is checked', async () => {
            const checkbox = { isVisible: true };
            const dataSource = getArrayLocationsDS({
                rowOptions: { checkbox },
            });

            currentValue.checked = ['BJ'];
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
                    { id: 'c-AF', parentId: undefined, isCheckable: true, isChecked: false, isChildrenChecked: true, checkbox },
                    { id: 'c-EU', parentId: undefined, isCheckable: true, checkbox },
                ]);
            });

            let view = hookResult.result.current;
            expect(view.selectAll).not.toBeNull();
            expect(view.selectAll!.value).toBeFalsy();
            expect(typeof view.selectAll!.onValueChange).toBe('function');
            expect(view.selectAll!.indeterminate).toBeTruthy();

            const afRow = view.getVisibleRows()[0];

            await act(() => {
                afRow.onFold?.(afRow);
            });

            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

            await waitFor(() => {
                view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 'c-AF', parentId: undefined, isCheckable: true, isChecked: false, isChildrenChecked: true, checkbox },
                    { id: 'DZ', isChecked: false },
                    { id: 'BJ', isChecked: true },
                ]);
            });
        });
    });
});
