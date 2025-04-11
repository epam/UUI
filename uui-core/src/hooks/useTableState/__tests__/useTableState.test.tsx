import { renderHookWithContextAsync, CustomWrapperType, act } from '@epam/uui-test-utils';
import { useTableState, UseTableStateHookParams } from '../useTableState';
import {
    DataColumnProps, DataTableState, IRouterContext, ITablePreset, TableFiltersConfig, UuiContexts,
} from '../../../types';
import { StubAdaptedRouter, UuiContext } from '../../../services';
import { useUuiServices } from '../../useUuiServices';
import React from 'react';

import { ArrayDataSource } from '../../../data';

const filters: TableFiltersConfig<any>[] = [
    {
        field: 'filter1',
        columnKey: 'column1',
        title: 'Title',
        isAlwaysVisible: true,
        type: 'singlePicker',
        dataSource: new ArrayDataSource({ items: [] }),
    },
    {
        field: 'filter2',
        columnKey: 'column2',
        title: 'Title',
        type: 'multiPicker',
        dataSource: new ArrayDataSource({ items: [] }),
        predicates: [{ predicate: 'in', name: 'is', isDefault: true }, { predicate: 'nin', name: 'is not' }],
    },
    {
        field: 'filter3',
        columnKey: 'column3',
        title: 'Title',
        type: 'rangeDatePicker',
    },
];

const columns: DataColumnProps[] = [
    {
        key: 'column1',
        caption: 'Column 1',
        width: 100,
    },
    {
        key: 'column2',
        caption: 'Column 2',
        width: 100,
    },
];

const preset2Value = {
    filter: {
        filter2: [1, 2],
        filter3: { from: 'date1', to: 'date2' },
    },
    columnsConfig: {
        column1: {
            isVisible: false,
            order: 'a',
            width: 120,
        },
        column2: {
            isVisible: true,
            order: 'b',
            width: 100,
        },
    },
    filtersConfig: {
        filter1: {
            isVisible: true,
            order: 'h',
        },
        filter2: {
            isVisible: true,
            order: 'q',
        },
        filter3: {
            isVisible: true,
            order: 'u',
        },
    },
    viewState: { userName: 'name', fullName: 'fullName' },
    sorting: [{ field: 'column1', direction: 'asc' }],
};

const presets: ITablePreset[] = [
    {
        name: 'Preset 1',
        id: 1,
        isReadonly: true,
        order: 'a',
        filter: {
            filter2: [1, 2],
        },
    },
    {
        name: 'Preset 2',
        id: 2,
        order: 'b',
        ...(preset2Value as any),
    },
];

const routerStab: IRouterContext = new StubAdaptedRouter();

const complexURLFilterValue: DataTableState = {
    page: 1,
    pageSize: 40,
    filter: {
        filter2: [1, 2],
    },
    columnsConfig: {
        column1: {
            isVisible: true,
            order: 'a',
            width: 100,
        },
        column2: {
            isVisible: false,
            order: 'b',
            width: 100,
        },
    },
    viewState: { userName: 'name' },
    sorting: [{ field: 'column2', direction: 'desc' }],
    presetId: 1,
};

const initialTableStateValue = {
    topIndex: 0,
    visibleCount: 40,
    page: undefined,
    pageSize: undefined,
    presetId: undefined,
    sorting: undefined,
    columnsConfig: undefined,
    filter: undefined,
    filtersConfig: {
        filter1: {
            isVisible: true,
            order: 'm',
        },
    },
};

let queryObject: any = {};

routerStab.getCurrentLink = () => {
    return {
        pathname: 'test_pathname',
        query: queryObject,
    };
};
const redirectMock = jest.fn().mockImplementation((val) => {
    queryObject = val.query;
});
const createHrefMock = jest.fn();
routerStab.redirect = redirectMock;
routerStab.createHref = createHrefMock;

const createNewPresetMock = jest.fn().mockResolvedValue(123);
const updatePresetMock = jest.fn();
const deletePresetMock = jest.fn(() => Promise.resolve());

const initHook = async (props?: UseTableStateHookParams) => {
    const testUuiCtx = {} as UuiContexts;
    const router = routerStab;
    const wrapper: CustomWrapperType = function UuiContextDefaultWrapper({ children }) {
        const { services } = useUuiServices({ router });
        Object.assign(testUuiCtx, services);
        return (
            (
                <UuiContext value={ services }>
                    { children }
                </UuiContext>
            )
        );
    };

    const { result } = await renderHookWithContextAsync(
        () =>
            useTableState({
                filters: filters,
                columns: columns,
                initialPresets: presets,
                onPresetCreate: createNewPresetMock,
                onPresetUpdate: updatePresetMock,
                onPresetDelete: deletePresetMock,
                ...props,
            }),
        {},
        { wrapper },
    );

    return {
        result,
        testUuiCtx,
    };
};
describe('useTableState', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        queryObject = { };
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it('Should get value from URL and create filtersConfig based on filter value', async () => {
        queryObject = complexURLFilterValue;
        const { result } = await initHook();
        expect(result.current.tableState).toEqual({
            ...complexURLFilterValue,
            filtersConfig: {
                filter1: {
                    isVisible: true,
                    order: 'm',
                },
                filter2: {
                    isVisible: true,
                    order: 's',
                },
            },
            topIndex: 0,
            visibleCount: 40,
        });
    });

    it('Should set table state value', async () => {
        const { result } = await initHook();
        const newValue: DataTableState = {
            page: 1,
            pageSize: 80,
            filter: {
                filter1: [1, 2],
            },
            columnsConfig: {
                column1: {
                    isVisible: true,
                    order: 'a',
                    width: 150,
                },
                column2: {
                    isVisible: false,
                    order: 'b',
                    width: 80,
                },
            },
            viewState: { userName: 'name', userFullName: 'fullName' },
            sorting: [{ field: 'column1', direction: 'asc' }],
            presetId: 10,
            filtersConfig: {
                filter1: {
                    isVisible: true,
                    order: 'm',
                },
                filter2: {
                    isVisible: false,
                    order: 's',
                },
                filter3: {
                    isVisible: true,
                    order: 'v',
                },
            },
            topIndex: 40,
            visibleCount: 40,
        };

        await act(() => result.current.setTableState(newValue));

        expect(result.current.tableState).toEqual(newValue);

        const { filtersConfig, topIndex, visibleCount, ...urlParams } = newValue;

        expect(redirectMock).toHaveBeenCalledWith({
            pathname: 'test_pathname',
            query: urlParams,
        });
    });

    it('Should remove empty values from filter and viewState', async () => {
        const { result } = await initHook();
        const newValue = {
            filter: {
                filter1: 1,
                filter2: undefined,
                filter3: undefined,
            },
            viewState: { userName: 'name', userFullName: undefined },
        };

        await act(() => result.current.setTableState({
            ...initialTableStateValue,
            ...newValue,
        }));

        expect(result.current.tableState).toEqual({
            ...initialTableStateValue,
            filter: { filter1: 1 },
            filtersConfig: {
                filter1: {
                    isVisible: true,
                    order: 'm',
                },
            },
            viewState: { userName: 'name' },
        });

        expect(redirectMock).toHaveBeenCalledWith({
            pathname: 'test_pathname',
            query: {
                filter: {
                    filter1: 1,
                },
                viewState: { userName: 'name' },
            },
        });
    });

    it('Should set filter value', async () => {
        const { result } = await initHook();
        const newValue = {
            filter2: [2],
            filter3: { from: 'date1', to: 'date2' },
        };

        await act(() => result.current.setFilter(newValue));

        expect(result.current.tableState).toEqual({
            ...initialTableStateValue,
            filter: newValue,
            filtersConfig: {
                filter1: {
                    isVisible: true,
                    order: 'm',
                },
                filter2: {
                    isVisible: true,
                    order: 's',
                },
                filter3: {
                    isVisible: true,
                    order: 'v',
                },
            },
        });

        expect(redirectMock).toHaveBeenCalledWith({
            pathname: 'test_pathname',
            query: {
                filter: newValue,
            },
        });
    });

    it('Should set columnsConfig value', async () => {
        const { result } = await initHook();
        const newValue = {
            column1: {
                isVisible: false,
                order: 'b',
                width: 120,
            },
            column2: {
                isVisible: true,
                order: 'a',
                width: 150,
            },
        };

        act(() => result.current.setColumnsConfig(newValue));

        expect(result.current.tableState).toEqual({
            ...initialTableStateValue,
            columnsConfig: newValue,
        });

        expect(redirectMock).toHaveBeenCalledWith({
            pathname: 'test_pathname',
            query: {
                columnsConfig: newValue,
            },
        });
    });

    it('Should set filtersConfig value', async () => {
        const { result } = await initHook();
        const newValue = {
            filter1: {
                isVisible: true,
                order: 'm',
            },
            filter2: {
                isVisible: true,
                order: 'q',
            },
            filter3: {
                isVisible: true,
                order: 'hq',
            },
        };

        act(() => result.current.setFiltersConfig(newValue));

        expect(result.current.tableState).toEqual({
            ...initialTableStateValue,
            filtersConfig: newValue,
        });
    });

    describe('presets', () => {
        it('Should get active preset Id from URL and get filtersConfig from it', async () => {
            queryObject.presetId = 2;
            const { result } = await initHook();

            expect(result.current.activePresetId).toEqual(2);
            expect(result.current.tableState.filtersConfig).toEqual(preset2Value.filtersConfig);
        });

        it('Should choose preset and set its table state value', async () => {
            const { result } = await initHook();

            expect(result.current.activePresetId).toEqual(undefined);

            act(() => result.current.choosePreset(presets[1]));

            expect(result.current.activePresetId).toEqual(2);

            expect(result.current.tableState).toEqual({
                ...preset2Value,
                topIndex: 0,
                visibleCount: 40,
                presetId: 2,
            });
            const { filtersConfig, ...rest } = preset2Value;
            expect(redirectMock).toHaveBeenCalledWith({
                pathname: 'test_pathname',
                query: {
                    ...rest,
                    presetId: 2,
                },
            });
        });

        it('Should create new preset with current filtration and choose it', async () => {
            const { result } = await initHook();

            expect(result.current.activePresetId).toEqual(undefined);

            act(() => result.current.setTableState({
                topIndex: 0,
                visibleCount: 40,
                ...complexURLFilterValue,
            }));

            expect(result.current.hasPresetChanged(presets[0])).toEqual(true);

            await act(() => result.current.createNewPreset('new_preset'));

            const { page, pageSize, presetId, ...presetFiltration } = complexURLFilterValue;

            expect(createNewPresetMock).toHaveBeenCalledWith({
                ...presetFiltration,
                name: 'new_preset',
                id: null,
                order: 'n',
                isReadonly: false,
                filtersConfig: {
                    filter1: {
                        isVisible: true,
                        order: 'm',
                    },
                    filter2: {
                        isVisible: true,
                        order: 's',
                    },
                },
            });

            // Api mock return new id=123
            expect(result.current.activePresetId).toEqual(123);

            expect(result.current.presets).toHaveLength(3);

            expect(result.current.tableState).toEqual({
                ...complexURLFilterValue,
                presetId: 123,
                topIndex: 0,
                visibleCount: 40,
                filtersConfig: {
                    filter1: {
                        isVisible: true,
                        order: 'm',
                    },
                    filter2: {
                        isVisible: true,
                        order: 's',
                    },
                },
            });
        });

        it('Should update preset with new value', async () => {
            queryObject.presetId = 2;
            const { result } = await initHook();

            expect(result.current.activePresetId).toEqual(2);

            const newPresetValue = { ...presets[1], filter: { filter2: [1] } };

            await act(() => result.current.updatePreset(newPresetValue));

            expect(updatePresetMock).toHaveBeenCalledWith(newPresetValue);
            expect(result.current.presets[1]).toEqual(newPresetValue);
        });

        it('Should delete preset', async () => {
            const { result } = await initHook();

            expect(result.current.activePresetId).toEqual(undefined);

            act(() => result.current.choosePreset(presets[1]));

            expect(result.current.activePresetId).toEqual(2);

            await act(() => result.current.deletePreset(presets[1]));

            expect(deletePresetMock).toHaveBeenCalledWith(presets[1]);

            expect(result.current.presets).toEqual([presets[0]]);
        });

        it('Should duplicate preset', async () => {
            const { result } = await initHook();

            await act(() => result.current.duplicatePreset(presets[0]));

            expect(result.current.presets).toHaveLength(3);

            expect(result.current.presets).toEqual([
                ...presets,
                {
                    name: 'Preset 1_copy',
                    id: 123,
                    isReadonly: false,
                    order: 'n',
                    filter: {
                        filter2: [
                            1,
                            2,
                        ],
                    },
                },
            ]);
        });

        it('Should detect if preset changed', async () => {
            const { result } = await initHook();
            act(() => result.current.choosePreset(presets[0]));

            expect(result.current.activePresetId).toEqual(1);

            expect(result.current.hasPresetChanged(presets[0])).toEqual(false);

            act(() => result.current.setFilter({}));

            expect(result.current.hasPresetChanged(presets[0])).toEqual(true);
        });

        it('Should return link on preset', async () => {
            const { result } = await initHook();
            const preset1 = presets[0];
            const { id, order, name, isReadonly, ...presetValue } = preset1;
            result.current.getPresetLink(preset1);
            expect(createHrefMock).toHaveBeenCalledWith({
                pathname: 'test_pathname',
                query: {
                    ...presetValue,
                    presetId: preset1.id,
                },
            });
        });
    });

    it('should use external value and onValueChange', async () => {
        const initialValue = {
            filter: {
                filter2: [1],
            },
            topIndex: 0,
            visibleCount: 40,
        };

        let value = initialValue;
        const onValueChange = jest.fn().mockImplementation((newVal) => { value = newVal; });

        const { result } = await initHook({ value, onValueChange });

        expect(result.current.tableState).toEqual(initialValue);

        await act(() => result.current.setFilter({ filter2: [1, 2, 3] }));

        expect(onValueChange).toHaveBeenCalledWith({
            ...initialValue,
            filter: {
                filter2: [1, 2, 3],
            },
            viewState: undefined,
            filtersConfig: {
                filter1: {
                    isVisible: true,
                    order: 'm',
                },
                filter2: {
                    isVisible: true,
                    order: 's',
                },
            },
        });

        expect(redirectMock).not.toBeCalled();
    });

    it('should reset paging on filter change', async () => {
        const { result } = await initHook();

        await act(() => result.current.setTableState({ ...result.current.tableState, page: 10 }));

        expect(result.current.tableState.page).toEqual(10);

        await act(() => result.current.setFilter({ filter2: [1] }));

        expect(result.current.tableState.page).toEqual(1);
    });
});
