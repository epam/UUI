import React from 'react';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { DataTableRow } from '../DataTableRow';

describe('DataTableRow', () => {
    it('should be rendered correctly', async () => {
        const node = await renderSnapshotWithContextAsync(
            <DataTableRow
                id="test"
                index={ 1 }
                rowKey="testRowKey"
                value={ { name: 'Test Product' } }
                columns={ [
                    {
                        key: 'id',
                        caption: 'ID',
                        render: (product) => <div>{product.name}</div>,
                        isSortable: true,
                        isAlwaysVisible: true,
                        grow: 0,
                        width: 96,
                    },
                ] }
            />,
        );
        expect(node).toMatchSnapshot();
    });
});
