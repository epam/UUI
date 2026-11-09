import React from 'react';
import { DataTableCellProps } from '@epam/uui-core';
import { fireEvent, renderWithContextAsync, screen } from '@epam/uui-test-utils';
import { DataTableCell } from '../DataTableCell';

describe('DataTableCell', () => {
    it('does not throw when an editable cell editor does not forward its ref', async () => {
        const props: Omit<DataTableCellProps<string, number, string>, 'key'> = {
            rowProps: {
                id: 1,
                rowKey: 'row-1',
                index: 0,
                value: 'Name',
            },
            column: {
                key: 'name',
                width: 100,
            },
            index: 0,
            isFirstColumn: false,
            isLastColumn: false,
            value: 'Name',
            onValueChange: jest.fn(),
            renderEditor: () => <button type="button">Editor without ref</button>,
        };

        await renderWithContextAsync(<DataTableCell { ...props } />);

        expect(() => fireEvent.click(screen.getByRole('button'))).not.toThrow();
    });
});
