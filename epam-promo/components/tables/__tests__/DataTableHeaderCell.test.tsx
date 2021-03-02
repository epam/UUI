import React from 'react';
import { DataTableHeaderCell } from '../DataTableHeaderCell';
import renderer from 'react-test-renderer';

jest.mock('react-dom', () => ({
    findDOMNode: jest.fn(),
}));

describe('DataTableHeaderCell', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<DataTableHeaderCell
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
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


