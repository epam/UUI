import React from 'react';
import { DataTableHeaderCell } from '../DataTableHeaderCell';
import { renderWithContextAsync } from '@epam/test-utils';

jest.mock('react-dom', () => ({
    findDOMNode: jest.fn(),
}));

describe('DataTableHeaderCell', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderWithContextAsync(
            <DataTableHeaderCell
                column={ {
                    key: 'test',
                    caption: 'Test',
                    render: () => <div>Test</div>,
                    width: 150,
                    fix: 'left',
                } }
                onSort={ jest.fn }
                isFirstColumn
                isLastColumn={ false }
                value={ {  } }
                onValueChange={ jest.fn }
            />
        );

        expect(tree).toMatchSnapshot();
    });
});


