import { renderHook, waitFor } from '@epam/uui-test-utils';
import { DataQueryFilter, DataRowProps, DataSourceState, IDataSourceView } from '../../../../types';
import { LocationItem, getLazyLocationsDS } from '../../__tests__/mocks';

describe('LazyListView - fold all', () => {
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

    it('should pass foldAll to isFoldedByDefault callback on init', async () => {
        const { dataSource } = getLazyLocationsDS({
            isFoldedByDefault: (_, state) => state.foldAll ?? false,
        });

        currentValue.visibleCount = 50;
        currentValue.foldAll = true;
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
    });

    it('should pass foldAll to isFoldedByDefault callback', async () => {
        const { dataSource } = getLazyLocationsDS({
            isFoldedByDefault: (_, state) => state.foldAll ?? false,
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
                { id: 'DZ', parentId: 'c-AF' },
                { id: '2474141', parentId: 'DZ' },
                { id: '2475744', parentId: 'DZ' },
                { id: '2475740', parentId: 'DZ' },
                { id: '2475752', parentId: 'DZ' },
                { id: '2475687', parentId: 'DZ' },
                { id: '2475612', parentId: 'DZ' },
                { id: '2475475', parentId: 'DZ' },
                { id: '2474638', parentId: 'DZ' },
                { id: '2474583', parentId: 'DZ' },
                { id: '2474506', parentId: 'DZ' },
                { id: 'BJ', parentId: 'c-AF' },
                { id: '2392505', parentId: 'BJ' },
                { id: '2392308', parentId: 'BJ' },
                { id: '2392204', parentId: 'BJ' },
                { id: '2392108', parentId: 'BJ' },
                { id: '2392087', parentId: 'BJ' },
                { id: '2392009', parentId: 'BJ' },
                { id: '2391895', parentId: 'BJ' },
                { id: '2391893', parentId: 'BJ' },
                { id: '2391455', parentId: 'BJ' },
                { id: '2391377', parentId: 'BJ' },
                { id: 'GM', parentId: 'c-AF' },
                { id: '2413920', parentId: 'GM' },
                { id: '2413876', parentId: 'GM' },
                { id: '2413753', parentId: 'GM' },
                { id: '2413515', parentId: 'GM' },
                { id: '2412749', parentId: 'GM' },
                { id: '2411880', parentId: 'GM' },
                { id: 'c-EU', parentId: undefined },
                { id: 'GB', parentId: 'c-EU' },
                { id: '2633655', parentId: 'GB' },
                { id: '2633563', parentId: 'GB' },
                { id: '2633553', parentId: 'GB' },
                { id: '2633551', parentId: 'GB' },
                { id: '2633521', parentId: 'GB' },
                { id: '2633485', parentId: 'GB' },
                { id: '2633406', parentId: 'GB' },
                { id: '2633397', parentId: 'GB' },
                { id: '2633373', parentId: 'GB' },
                { id: '2633352', parentId: 'GB' },
            ]);
        });

        currentValue.foldAll = true;
        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

        await waitFor(() => {
            const view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 'c-AF', parentId: undefined },
                { id: 'c-EU', parentId: undefined },
            ]);
        });
    });

    it('should unfold all nodes on foldAll: false if isFoldedByDefault is not passed', async () => {
        const { dataSource } = getLazyLocationsDS({});

        currentValue.visibleCount = 50;
        currentValue.foldAll = false;
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
                { id: 'DZ', parentId: 'c-AF' },
                { id: '2474141', parentId: 'DZ' },
                { id: '2475744', parentId: 'DZ' },
                { id: '2475740', parentId: 'DZ' },
                { id: '2475752', parentId: 'DZ' },
                { id: '2475687', parentId: 'DZ' },
                { id: '2475612', parentId: 'DZ' },
                { id: '2475475', parentId: 'DZ' },
                { id: '2474638', parentId: 'DZ' },
                { id: '2474583', parentId: 'DZ' },
                { id: '2474506', parentId: 'DZ' },
                { id: 'BJ', parentId: 'c-AF' },
                { id: '2392505', parentId: 'BJ' },
                { id: '2392308', parentId: 'BJ' },
                { id: '2392204', parentId: 'BJ' },
                { id: '2392108', parentId: 'BJ' },
                { id: '2392087', parentId: 'BJ' },
                { id: '2392009', parentId: 'BJ' },
                { id: '2391895', parentId: 'BJ' },
                { id: '2391893', parentId: 'BJ' },
                { id: '2391455', parentId: 'BJ' },
                { id: '2391377', parentId: 'BJ' },
                { id: 'GM', parentId: 'c-AF' },
                { id: '2413920', parentId: 'GM' },
                { id: '2413876', parentId: 'GM' },
                { id: '2413753', parentId: 'GM' },
                { id: '2413515', parentId: 'GM' },
                { id: '2412749', parentId: 'GM' },
                { id: '2411880', parentId: 'GM' },
                { id: 'c-EU', parentId: undefined },
                { id: 'GB', parentId: 'c-EU' },
                { id: '2633655', parentId: 'GB' },
                { id: '2633563', parentId: 'GB' },
                { id: '2633553', parentId: 'GB' },
                { id: '2633551', parentId: 'GB' },
                { id: '2633521', parentId: 'GB' },
                { id: '2633485', parentId: 'GB' },
                { id: '2633406', parentId: 'GB' },
                { id: '2633397', parentId: 'GB' },
                { id: '2633373', parentId: 'GB' },
                { id: '2633352', parentId: 'GB' },
            ]);
        });

        currentValue.foldAll = true;
        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

        await waitFor(() => {
            const view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 'c-AF', parentId: undefined },
                { id: 'c-EU', parentId: undefined },
            ]);
        });
    });

    it('should fold all nodes on foldAll: true', async () => {
        const { dataSource } = getLazyLocationsDS({});

        currentValue.visibleCount = 50;
        currentValue.folded = { 'c-AF': false };

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
                { id: 'DZ', parentId: 'c-AF' },
                { id: 'BJ', parentId: 'c-AF' },
                { id: 'GM', parentId: 'c-AF' },
                { id: 'c-EU', parentId: undefined },
            ]);
        });

        currentValue.foldAll = true;
        currentValue.folded = {};
        hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

        await waitFor(() => {
            const view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: 'c-AF', parentId: undefined },
                { id: 'c-EU', parentId: undefined },
            ]);
        });
    });
});
