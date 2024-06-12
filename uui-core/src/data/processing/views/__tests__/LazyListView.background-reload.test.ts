import { renderHook, waitFor, act } from '@epam/uui-test-utils';
import { DataQueryFilter, DataRowProps, DataSourceState, IDataSourceView } from '../../../../types';
import { LocationItem, getLazyLocationsDS, getLazyPagedLocationsDS } from '../../__tests__/mocks';

describe('LazyListView - background reload', () => {
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

    it.each([true, false])
    ('should show placeholders and isReloading flag on init when backgroundReload = %s', async (backgroundReload) => {
        const { dataSource } = getLazyLocationsDS({
            backgroundReload,
        });

        const hookResult = renderHook(
            ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
            { initialProps: {
                value: currentValue,
                onValueChange: onValueChanged,
                props: {},
            } },
        );

        let view = hookResult.result.current;
        await waitFor(() => {
            const listProps = view.getListProps();
            expect(listProps.isReloading).toBeTruthy();
        });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { isLoading: true }, { isLoading: true }, { isLoading: true },
                ],
            );
        });

        await waitFor(() => {
            view = hookResult.result.current;
            expectViewToLookLike(view, [{ id: 'c-AF' }, { id: 'c-EU' }]);
        });

        expect(view.getListProps().rowsCount).toEqual(2);
    });

    describe('backgroundReload = true', () => {
        it('should not show placeholders on filter (from props) change with backgroundReload = true', async () => {
            const { dataSource } = getLazyLocationsDS({
                backgroundReload: true,
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

            let view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { isLoading: true }, { isLoading: true }, { isLoading: true },
                ],
            );

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeFalsy();
            });

            view = hookResult.result.current;
            expectViewToLookLike(view, [{ id: 'c-AF' }, { id: 'c-EU' }]);

            expect(view.getListProps().rowsCount).toEqual(2);

            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: { filter: { id: 'c-EU' } } });
            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeTruthy();
            });

            expectViewToLookLike(
                view,
                [
                    { id: 'c-AF' }, { id: 'c-EU' },
                ],
            );
            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeFalsy();
            });

            view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { id: 'c-EU' },
                ],
            );
        });

        it('should not show placeholders on filter (from state) change with backgroundReload = true', async () => {
            const { dataSource } = getLazyLocationsDS({
                backgroundReload: true,
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

            let view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { isLoading: true }, { isLoading: true }, { isLoading: true },
                ],
            );

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeFalsy();
            });

            view = hookResult.result.current;
            expectViewToLookLike(view, [{ id: 'c-AF' }, { id: 'c-EU' }]);

            expect(view.getListProps().rowsCount).toEqual(2);

            currentValue.filter = { id: 'c-EU' };
            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });
            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeTruthy();
            });

            expectViewToLookLike(
                view,
                [
                    { id: 'c-AF' }, { id: 'c-EU' },
                ],
            );

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeFalsy();
            });

            view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { id: 'c-EU' },
                ],
            );
        });

        it('should not show placeholders on search change with backgroundReload = true', async () => {
            const { dataSource } = getLazyLocationsDS({
                backgroundReload: true,
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

            let view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { isLoading: true }, { isLoading: true }, { isLoading: true },
                ],
            );

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeFalsy();
            });

            view = hookResult.result.current;
            expectViewToLookLike(view, [{ id: 'c-AF' }, { id: 'c-EU' }]);

            expect(view.getListProps().rowsCount).toEqual(2);

            currentValue.search = 'Eur';
            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });
            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeTruthy();
            });

            expectViewToLookLike(
                view,
                [
                    { id: 'c-AF' }, { id: 'c-EU' },
                ],
            );

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeFalsy();
            });

            view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { id: 'c-EU' },
                ],
            );
        });

        it('should not show placeholders on sort change with backgroundReload = true', async () => {
            const { dataSource } = getLazyLocationsDS({
                backgroundReload: true,
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

            let view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { isLoading: true }, { isLoading: true }, { isLoading: true },
                ],
            );

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeFalsy();
            });

            view = hookResult.result.current;
            expectViewToLookLike(view, [{ id: 'c-AF' }, { id: 'c-EU' }]);

            expect(view.getListProps().rowsCount).toEqual(2);

            currentValue.sorting = [{ field: 'name', direction: 'desc' }];
            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });
            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeTruthy();
            });

            expectViewToLookLike(
                view,
                [
                    { id: 'c-AF' }, { id: 'c-EU' },
                ],
            );

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeFalsy();
            });

            view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { id: 'c-EU' }, { id: 'c-AF' },
                ],
            );
        });

        it('should not show placeholders on force reload with backgroundReload = true', async () => {
            const { dataSource } = getLazyLocationsDS({
                backgroundReload: true,
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

            let view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { isLoading: true }, { isLoading: true }, { isLoading: true },
                ],
            );

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeFalsy();
            });

            view = hookResult.result.current;
            expectViewToLookLike(view, [{ id: 'c-AF' }, { id: 'c-EU' }]);

            expect(view.getListProps().rowsCount).toEqual(2);

            act(() => view.reload());

            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeTruthy();
            });

            expectViewToLookLike(view, [{ id: 'c-AF' }, { id: 'c-EU' }]);

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeFalsy();
            });

            expectViewToLookLike(view, [{ id: 'c-AF' }, { id: 'c-EU' }]);
        });

        it('should not show placeholders on page change with backgroundReload = true', async () => {
            const { dataSource } = getLazyPagedLocationsDS({
                backgroundReload: true,
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

            let view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { isLoading: true }, { isLoading: true }, { isLoading: true },
                ],
            );

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeFalsy();
            });

            view = hookResult.result.current;
            expectViewToLookLike(view, [{ id: 'c-AF' }, { id: 'c-EU' }]);

            expect(view.getListProps().rowsCount).toEqual(2);

            currentValue.page = 1;
            currentValue.pageSize = 1;
            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeTruthy();
            });

            expectViewToLookLike(view, [{ id: 'c-AF' }, { id: 'c-EU' }]);

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeFalsy();
            });

            expectViewToLookLike(view, [{ id: 'c-AF' }]);

            currentValue.page = 2;
            currentValue.pageSize = 1;
            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeTruthy();
            });

            expectViewToLookLike(view, [{ id: 'c-AF' }]);

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeFalsy();
            });

            expectViewToLookLike(view, [{ id: 'c-EU' }]);
        });

        it('should not show placeholders on pageSize change with backgroundReload = true', async () => {
            const { dataSource } = getLazyPagedLocationsDS({
                backgroundReload: true,
                isFoldedByDefault: () => false,
            });
            const viewProps = { filter: { parentId: 'BJ' } };
            const hookResult = renderHook(
                ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                { initialProps: {
                    value: currentValue,
                    onValueChange: onValueChanged,
                    props: viewProps,
                } },
            );

            await waitFor(() => {
                const view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeTruthy();
            });

            let view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { isLoading: true }, { isLoading: true }, { isLoading: true },
                ],
            );

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeFalsy();
            });

            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: '2392505', parentId: 'BJ', indent: 0 },
                { id: '2392308', parentId: 'BJ', indent: 0 },
                { id: '2392204', parentId: 'BJ', indent: 0 },
            ]);

            currentValue.page = 1;
            currentValue.pageSize = 2;
            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: viewProps });

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeTruthy();
            });

            expectViewToLookLike(view, [
                { id: '2392505', parentId: 'BJ', indent: 0 },
                { id: '2392308', parentId: 'BJ', indent: 0 },
                { id: '2392204', parentId: 'BJ', indent: 0 },
            ]);

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeFalsy();
            });

            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: '2392505', parentId: 'BJ', indent: 0 },
                { id: '2392308', parentId: 'BJ', indent: 0 },
            ]);
            currentValue.page = 1;
            currentValue.pageSize = 4;
            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: viewProps });

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeTruthy();
            });

            expectViewToLookLike(view, [
                { id: '2392505', parentId: 'BJ', indent: 0 },
                { id: '2392308', parentId: 'BJ', indent: 0 },
            ]);

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeFalsy();
            });

            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: '2392505', parentId: 'BJ', indent: 0 },
                { id: '2392308', parentId: 'BJ', indent: 0 },
                { id: '2392204', parentId: 'BJ', indent: 0 },
            ]);
        });
    });

    describe('backgroundReload = false', () => {
        it('should show placeholders on filter (from props) change with backgroundReload = false', async () => {
            const { dataSource } = getLazyLocationsDS({});

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

            let view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { isLoading: true }, { isLoading: true }, { isLoading: true },
                ],
            );

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeFalsy();
            });

            view = hookResult.result.current;
            expectViewToLookLike(view, [{ id: 'c-AF' }, { id: 'c-EU' }]);

            expect(view.getListProps().rowsCount).toEqual(2);

            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: { filter: { id: 'c-EU' } } });
            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeTruthy();
            });

            expectViewToLookLike(
                view,
                [
                    { isLoading: true }, { isLoading: true }, { isLoading: true },
                ],
            );
            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeFalsy();
            });

            view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { id: 'c-EU' },
                ],
            );
        });

        it('should show placeholders on filter (from state) change with backgroundReload = true', async () => {
            const { dataSource } = getLazyLocationsDS({});

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

            let view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { isLoading: true }, { isLoading: true }, { isLoading: true },
                ],
            );

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeFalsy();
            });

            view = hookResult.result.current;
            expectViewToLookLike(view, [{ id: 'c-AF' }, { id: 'c-EU' }]);

            expect(view.getListProps().rowsCount).toEqual(2);

            currentValue.filter = { id: 'c-EU' };
            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });
            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeTruthy();
            });

            expectViewToLookLike(
                view,
                [
                    { isLoading: true }, { isLoading: true }, { isLoading: true },
                ],
            );

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeFalsy();
            });

            view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { id: 'c-EU' },
                ],
            );
        });

        it('should show placeholders on search change with backgroundReload = true', async () => {
            const { dataSource } = getLazyLocationsDS({});

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

            let view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { isLoading: true }, { isLoading: true }, { isLoading: true },
                ],
            );

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeFalsy();
            });

            view = hookResult.result.current;
            expectViewToLookLike(view, [{ id: 'c-AF' }, { id: 'c-EU' }]);

            expect(view.getListProps().rowsCount).toEqual(2);

            currentValue.search = 'Eur';
            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });
            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeTruthy();
            });

            expectViewToLookLike(
                view,
                [
                    { isLoading: true }, { isLoading: true }, { isLoading: true },
                ],
            );

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeFalsy();
            });

            view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { id: 'c-EU' },
                ],
            );
        });

        it('should show placeholders on sort change with backgroundReload = true', async () => {
            const { dataSource } = getLazyLocationsDS({});

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

            let view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { isLoading: true }, { isLoading: true }, { isLoading: true },
                ],
            );

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeFalsy();
            });

            view = hookResult.result.current;
            expectViewToLookLike(view, [{ id: 'c-AF' }, { id: 'c-EU' }]);

            expect(view.getListProps().rowsCount).toEqual(2);

            currentValue.sorting = [{ field: 'name', direction: 'desc' }];
            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });
            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeTruthy();
            });

            expectViewToLookLike(
                view,
                [
                    { isLoading: true }, { isLoading: true }, { isLoading: true },
                ],
            );

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeFalsy();
            });

            view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { id: 'c-EU' }, { id: 'c-AF' },
                ],
            );
        });

        it('should show placeholders on page change with backgroundReload = true', async () => {
            const { dataSource } = getLazyPagedLocationsDS({});

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

            let view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { isLoading: true }, { isLoading: true }, { isLoading: true },
                ],
            );

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeFalsy();
            });

            view = hookResult.result.current;
            expectViewToLookLike(view, [{ id: 'c-AF' }, { id: 'c-EU' }]);

            expect(view.getListProps().rowsCount).toEqual(2);

            currentValue.page = 1;
            currentValue.pageSize = 1;
            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeTruthy();
            });

            expectViewToLookLike(view, [
                { isLoading: true }, { isLoading: true }, { isLoading: true },
            ]);

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeFalsy();
            });

            expectViewToLookLike(view, [{ id: 'c-AF' }]);

            currentValue.page = 2;
            currentValue.pageSize = 1;
            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeTruthy();
            });

            expectViewToLookLike(view, [
                { isLoading: true }, { isLoading: true }, { isLoading: true },
            ]);

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeFalsy();
            });

            expectViewToLookLike(view, [{ id: 'c-EU' }]);
        });

        it('should show placeholders on pageSize change with backgroundReload = true', async () => {
            const { dataSource } = getLazyPagedLocationsDS({
                isFoldedByDefault: () => false,
            });
            const viewProps = { filter: { parentId: 'BJ' } };
            const hookResult = renderHook(
                ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                { initialProps: {
                    value: currentValue,
                    onValueChange: onValueChanged,
                    props: viewProps,
                } },
            );

            await waitFor(() => {
                const view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeTruthy();
            });

            let view = hookResult.result.current;
            expectViewToLookLike(
                view,
                [
                    { isLoading: true }, { isLoading: true }, { isLoading: true },
                ],
            );

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeFalsy();
            });

            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: '2392505', parentId: 'BJ', indent: 0 },
                { id: '2392308', parentId: 'BJ', indent: 0 },
                { id: '2392204', parentId: 'BJ', indent: 0 },
            ]);

            currentValue.page = 1;
            currentValue.pageSize = 2;
            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: viewProps });

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeTruthy();
            });

            expectViewToLookLike(view, [
                { isLoading: true }, { isLoading: true }, { isLoading: true },
            ]);

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeFalsy();
            });

            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: '2392505', parentId: 'BJ', indent: 0 },
                { id: '2392308', parentId: 'BJ', indent: 0 },
            ]);
            currentValue.page = 1;
            currentValue.pageSize = 4;
            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: viewProps });

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeTruthy();
            });

            expectViewToLookLike(view, [
                { isLoading: true }, { isLoading: true }, { isLoading: true },
            ]);

            await waitFor(() => {
                view = hookResult.result.current;
                const listProps = view.getListProps();
                expect(listProps.isReloading).toBeFalsy();
            });

            view = hookResult.result.current;
            expectViewToLookLike(view, [
                { id: '2392505', parentId: 'BJ', indent: 0 },
                { id: '2392308', parentId: 'BJ', indent: 0 },
                { id: '2392204', parentId: 'BJ', indent: 0 },
            ]);
        });
    });
});
