import React from 'react';
import { DataTableHeaderCell } from '../DataTableHeaderCell';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { DataColumnProps } from '@epam/uui-core';

describe('DataTableHeaderCell', () => {
    it('should be rendered correctly', async () => {
        const col: DataColumnProps = {
            key: 'test',
            caption: 'Test',
            render: () => <div>Test</div>,
            width: 150,
            fix: 'left',
        };
        const tree = await renderSnapshotWithContextAsync(
            <DataTableHeaderCell key="test" column={ col } onSort={ jest.fn } isFirstColumn isLastColumn={ false } value={ {} } onValueChange={ jest.fn } />,
        );

        expect(tree).toMatchSnapshot();
    });
});
