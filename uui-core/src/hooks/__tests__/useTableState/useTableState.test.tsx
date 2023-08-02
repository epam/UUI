import { renderHookWithContextAsync, CustomWrapperType, act } from '@epam/uui-test-utils';
import { useTableState } from '../../useTableState';
import { DataColumnProps, DataTableState, IRouterContext, TableFiltersConfig, UuiContexts } from '../../../types';
import { StubAdaptedRouter, UuiContext } from '../../../services';
import { useUuiServices } from '../../useUuiServices';
import React from 'react';

import { ArrayDataSource } from '@epam/uui-core';
import { defaultPredicates } from '@epam/uui';

export const filters: TableFiltersConfig<any>[] = [
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
        predicates: defaultPredicates.multiPicker,
    },
    {
        field: 'filter3',
        columnKey: 'column3',
        title: 'Title',
        type: 'rangeDatePicker',
    },
];

export const columns: DataColumnProps[] = [
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

const routerStab: IRouterContext = new StubAdaptedRouter();

const initialTableState: DataTableState = {
    page: 1,
    pageSize: 40,
    filter: {
        filter2: [1, 2],
        filter4: [1],
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

routerStab.getCurrentLink = () => ({
    pathname: 'test_pathname',
    query: initialTableState,
});
const redirectMock = jest.fn();
routerStab.redirect = redirectMock;
const initHook = async () => {
    const testUuiCtx = {} as UuiContexts;
    const router = routerStab;
    const wrapper: CustomWrapperType = function UuiContextDefaultWrapper({ children }) {
        const { services } = useUuiServices({ router });
        Object.assign(testUuiCtx, services);
        return (
            <UuiContext.Provider value={ services }>
                { children }
            </UuiContext.Provider>
        );
    };

    const { result } = await renderHookWithContextAsync(
        () =>
            useTableState({ filters: filters, columns: columns }),
        {},
        { wrapper },
    );

    return {
        result: result.current,
        testUuiCtx,
    };
};
describe('useTableState', () => {
    beforeEach(jest.clearAllMocks);
    afterAll(() => {
        jest.resetAllMocks();
    });

    it('Should get value from URL', async () => {
        const { result } = await initHook();
        expect(result.tableState).toEqual({
            ...initialTableState,
            filtersConfig: {
                filter1: {
                    isVisible: true,
                    order: 'h',
                },
                filter2: {
                    isVisible: true,
                    order: 'q',
                },
            },
            topIndex: 0,
            visibleCount: 40,
        });
    });

    it('Should set filter value', async () => {
        const { result } = await initHook();
        act(
            () => result.setFilter({
                filter1: 1,
                filter2: [2],
            }),
        );

        expect(redirectMock).toHaveBeenCalledWith({
            pathname: 'test_pathname',
            query: {
                ...initialTableState,
                filter: {
                    filter1: 1,
                    filter2: [2],
                },
            },
        });
    });
});
