import { act, renderHook, waitFor } from '@epam/uui-test-utils';
import { DataQueryFilter, DataRowProps, DataSourceState, IDataSourceView } from '../../../../types';
import { LocationItem, getAsyncLocationsDS } from '../../__tests__/mocks';

describe('AsyncListView - show only selected', () => {
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

    it('should load items if showSelectedOnly = true', async () => {
        const { apiMock, dataSource } = getAsyncLocationsDS({
            showSelectedOnly: true,
        });

        currentValue.checked = ['BJ', 'c-AF', 'DZ'];
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
            const listProps = view.getListProps();
            expect(listProps.isReloading).toBeTruthy();
        });

        await waitFor(() => {
            const view = hookResult.result.current;
            const listProps = view.getListProps();
            expect(listProps.isReloading).toBeFalsy();
        });

        await waitFor(() => {
            expect(apiMock).toBeCalledTimes(1);
        });

        const view = hookResult.result.current;
        expect(view.getListProps().rowsCount).toEqual(3);
    });

    it('should load only selected item if showSelectedOnly = true', async () => {
        const { apiMock, dataSource } = getAsyncLocationsDS({
            showSelectedOnly: true,
        });

        currentValue.selectedId = 'c-EU';
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
            const listProps = view.getListProps();
            expect(listProps.isReloading).toBeTruthy();
        });

        await waitFor(() => {
            const view = hookResult.result.current;
            const listProps = view.getListProps();
            expect(listProps.isReloading).toBeFalsy();
        });

        await waitFor(() => {
            expect(apiMock).toBeCalledTimes(1);
        });

        const view = hookResult.result.current;
        expect(view.getListProps().rowsCount).toEqual(0);
    });

    it('should load checked and selected items if showSelectedOnly = true', async () => {
        const { apiMock, dataSource } = getAsyncLocationsDS({
            showSelectedOnly: true,
        });

        currentValue.checked = ['BJ', 'c-AF', 'DZ'];
        currentValue.selectedId = 'c-EU';
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
            const listProps = view.getListProps();
            expect(listProps.isReloading).toBeTruthy();
        });

        await waitFor(() => {
            const view = hookResult.result.current;
            const listProps = view.getListProps();
            expect(listProps.isReloading).toBeFalsy();
        });

        await waitFor(() => {
            expect(apiMock).toBeCalledTimes(1);
        });

        const view = hookResult.result.current;
        expect(view.getListProps().rowsCount).toEqual(3);
    });

    it('should load checked and selected items and their parents if showSelectedOnly = false', async () => {
        const { apiMock, dataSource } = getAsyncLocationsDS({
            showSelectedOnly: false,
        });

        currentValue.checked = ['BJ', '2392308'];
        currentValue.selectedId = '2474506';
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
            const listProps = view.getListProps();
            expect(listProps.isReloading).toBeTruthy();
        });

        await waitFor(() => {
            const view = hookResult.result.current;
            const listProps = view.getListProps();
            expect(listProps.isReloading).toBeTruthy();
        });

        await waitFor(() => {
            expect(apiMock).toBeCalledTimes(1);
        });

        await waitFor(() => {
            const view = hookResult.result.current;
            expect(view.getListProps().isReloading).toBeFalsy();
        });

        const view = hookResult.result.current;
        expectViewToLookLike(view, [
            { id: 'c-AF' },
            { id: 'c-EU' },
        ]);
    });

    it('should show only selected rows in order of selection', async () => {
        const { apiMock, dataSource } = getAsyncLocationsDS({
            showSelectedOnly: false,
        });

        currentValue.checked = ['BJ', '2392308', 'c-AF'];
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
            { initialProps: {
                value: currentValue,
                onValueChange: onValueChanged,
                props: {},
            } },
        );

        await waitFor(() => {
            expect(apiMock).toBeCalledTimes(1);
        });

        await waitFor(() => {
            const view = hookResult.result.current;
            expect(view.getListProps().isReloading).toBeTruthy();
        });

        await waitFor(() => {
            const view = hookResult.result.current;
            expect(view.getListProps().isReloading).toBeFalsy();
        });

        let view = hookResult.result.current;
        expectViewToLookLike(view, [
            { id: 'c-AF' },
            { id: 'c-EU' },
        ]);

        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: { showSelectedOnly: true } });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 'BJ', value: expect.objectContaining({ parentId: 'c-AF' }), indent: 0, depth: 0 },
                { id: '2392308', value: expect.objectContaining({ parentId: 'BJ' }), indent: 0, depth: 0 },
                { id: 'c-AF', indent: 0, depth: 0 },
            ]);
        });
    });

    it('should show only selected rows if on init showSelectedOnly = true', async () => {
        const { apiMock, dataSource } = getAsyncLocationsDS({
            showSelectedOnly: true,
        });

        currentValue.checked = ['BJ', '2392308', 'c-AF'];
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
            { initialProps: {
                value: currentValue,
                onValueChange: onValueChanged,
                props: {},
            } },
        );

        await waitFor(() => {
            expect(apiMock).toBeCalledTimes(1);
        });

        await waitFor(() => {
            const view = hookResult.result.current;
            const listProps = view.getListProps();
            expect(listProps.isReloading).toBeTruthy();
        });

        await waitFor(() => {
            const view = hookResult.result.current;
            expect(view.getListProps().isReloading).toBeFalsy();
        });

        const view = hookResult.result.current;
        expectViewToLookLike(view, [
            { id: 'BJ' },
            { id: '2392308' },
            { id: 'c-AF' },
        ]);
    });

    it('should remove items from showSelectedOnly rows on uncheck with cascadeSelection = explicit', async () => {
        const { dataSource } = getAsyncLocationsDS({
            showSelectedOnly: false,
            cascadeSelection: 'explicit',
            rowOptions: { checkbox: { isVisible: true } },
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
            const listProps = view.getListProps();
            expect(listProps.isReloading).toBeTruthy();
        });

        await waitFor(() => {
            const view = hookResult.result.current;
            const listProps = view.getListProps();
            expect(listProps.isReloading).toBeFalsy();
        });

        await waitFor(() => {
            const view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 'c-AF', isChecked: false },
                { id: 'c-EU', isChecked: false },
            ]);
        });

        let view = hookResult.result.current;
        let rows = view.getVisibleRows();
        const rowAF = rows[0];
        await act(() => {
            rowAF.onCheck?.(rowAF);
        });

        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 'c-AF', isChecked: true },
                { id: 'c-EU', isChecked: false },
            ]);
        });

        expect(currentValue).toEqual(
            expect.objectContaining({ checked: [
                'c-AF',
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
                'GM',
                '2413920',
                '2413876',
                '2413753',
                '2413515',
                '2412749',
                '2411880',
            ],
            topIndex: 0,
            visibleCount: 3 }),
        );

        currentValue.visibleCount = 5;
        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: { showSelectedOnly: true } });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 'c-AF', isChecked: true },
                { id: 'DZ', isChecked: true },
                { id: '2474141', isChecked: true },
                { id: '2475744', isChecked: true },
                { id: '2475740', isChecked: true },
            ]);
        });

        rows = view.getVisibleRows();
        const checkedRowDZ = rows[1];

        await act(() => {
            checkedRowDZ.onCheck?.(checkedRowDZ);
        });

        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: { showSelectedOnly: true } });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 'BJ', isChecked: true },
                { id: '2392505', isChecked: true },
                { id: '2392308', isChecked: true },
                { id: '2392204', isChecked: true },
                { id: '2392108', isChecked: true },
            ]);
        });

        expect(currentValue).toEqual(
            expect.objectContaining({ checked: [
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
                'GM',
                '2413920',
                '2413876',
                '2413753',
                '2413515',
                '2412749',
                '2411880',
            ],
            topIndex: 0,
            visibleCount: 5 }),
        );
    });

    it('should not clear loading checked items if showSelectedOnly = true', async () => {
        const { dataSource } = getAsyncLocationsDS({
            showSelectedOnly: true,
            rowOptions: { checkbox: { isVisible: true } },
        });

        currentValue.checked = ['BJ', 'c-AF', 'DZ'];
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
            { initialProps: {
                value: currentValue,
                onValueChange: onValueChanged,
                props: {},
            } },
        );

        let view = hookResult.result.current;
        await act(() => {
            view.clearAllChecked();
        });

        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

        await waitFor(() => {
            view = hookResult.result.current;
            expect(view.getListProps().isReloading).toBeFalsy();
        });

        expect(currentValue).toEqual(
            expect.objectContaining({ checked: ['BJ', 'c-AF', 'DZ'], topIndex: 0, visibleCount: 3 }),
        );
    });

    it('should clear loaded checked items if showSelectedOnly = true', async () => {
        const { apiMock, dataSource } = getAsyncLocationsDS({
            showSelectedOnly: true,
            rowOptions: { checkbox: { isVisible: true } },
        });

        currentValue.checked = [
            'BJ',
            'DZ',
            '2392505',
            '2392308',
            '2392204',
            '2392108',
            '2392087',
            '2392009',
            '2391895',
            '2391893',
            '2391455',
        ];

        const hookResult = renderHook(
            ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
            { initialProps: {
                value: currentValue,
                onValueChange: onValueChanged,
                props: {},
            } },
        );

        await waitFor(() => {
            expect(apiMock).toBeCalledTimes(1);
        });

        await waitFor(() => {
            const view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 'BJ', isChecked: true },
                { id: 'DZ', isChecked: true },
                { id: '2392505', isChecked: true },
            ]);
        });

        const view = hookResult.result.current;
        await act(() => {
            view.clearAllChecked();
        });

        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

        await waitFor(() => {
            expect(currentValue).toEqual(
                expect.objectContaining({ checked: [], topIndex: 0, visibleCount: 3 }),
            );
        });
    });

    it('should load tree after clearing checked values with showSelectedOnly = true', async () => {
        const { dataSource } = getAsyncLocationsDS({
            showSelectedOnly: true,
            rowOptions: { checkbox: { isVisible: true } },
        });

        currentValue.checked = [
            'SOME_UNKNONW_ITEM',
            'BJ',
            'DZ',
            '2392505',
            '2392308',
            '2392204',
            '2392108',
            '2392087',
            '2392009',
            '2391895',
            '2391893',
            '2391455',
        ];

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
                { id: 'BJ', isChecked: true },
                { id: 'DZ', isChecked: true },
                { id: '2392505', isChecked: true },
            ]);
        }, {});

        let view = hookResult.result.current;
        await act(() => {
            view.clearAllChecked();
        });

        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

        await waitFor(() => {
            expect(currentValue).toEqual(
                expect.objectContaining({ checked: [], topIndex: 0, visibleCount: 3 }),
            );
        });

        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: { showSelectedOnly: false } });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 'c-AF' },
                { id: 'c-EU' },
            ]);
        }, {});
    });
});
