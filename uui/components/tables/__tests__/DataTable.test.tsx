import React, { useState } from 'react';
import { DataColumnProps, DataTableState, useArrayDataSource } from '@epam/uui-core';
import {
    fireEvent, renderSnapshotWithContextAsync, renderWithContextAsync, screen, waitFor,
} from '@epam/uui-test-utils';
import { DataTable } from '../DataTable';

class ResizeObserverMock {
    observe = () => jest.fn();
    unobserve = () => jest.fn();
    disconnect = () => jest.fn();
}

global.ResizeObserver = ResizeObserverMock;

describe('DataTable', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<DataTable cx="user-class" columns={ [] } getRows={ () => [] } value={ {} } onValueChange={ jest.fn } />);
        expect(tree).toMatchSnapshot();
    });

    it('should have role=table', async () => {
        await renderWithContextAsync(<DataTable columns={ [] } getRows={ () => [] } value={ {} } onValueChange={ jest.fn } />);
        expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should hide/show select all checkbox together with rows checkboxes, when getRowOptions changes', async () => {
        type Item = { id: number; name: string };
        const items: Item[] = [{ id: 1, name: 'First' }, { id: 2, name: 'Second' }];
        const columns: DataColumnProps<Item, number>[] = [
            { key: 'name', caption: 'Name', render: (item) => item.name, width: 200 },
        ];

        function TestTable() {
            const [isCheckboxVisible, setIsCheckboxVisible] = useState(true);
            const [tableState, setTableState] = useState<DataTableState>({});
            const dataSource = useArrayDataSource<Item, number, unknown>({ items }, []);
            const view = dataSource.useView(tableState, setTableState, {
                getRowOptions: () => ({ checkbox: { isVisible: isCheckboxVisible } }),
            });

            return (
                <>
                    <button onClick={ () => setIsCheckboxVisible((value) => !value) }>Toggle checkboxes</button>
                    <DataTable
                        { ...view.getListProps() }
                        getRows={ view.getVisibleRows }
                        value={ tableState }
                        onValueChange={ setTableState }
                        columns={ columns }
                    />
                </>
            );
        }

        await renderWithContextAsync(<TestTable />);

        // 2 rows checkboxes + select all checkbox
        await waitFor(() => expect(screen.queryAllByRole('checkbox')).toHaveLength(3));

        fireEvent.click(screen.getByRole('button', { name: 'Toggle checkboxes' }));
        await waitFor(() => expect(screen.queryAllByRole('checkbox')).toHaveLength(0));

        fireEvent.click(screen.getByRole('button', { name: 'Toggle checkboxes' }));
        await waitFor(() => expect(screen.queryAllByRole('checkbox')).toHaveLength(3));
    });
});
