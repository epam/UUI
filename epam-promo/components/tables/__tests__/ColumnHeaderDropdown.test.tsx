import React from 'react';
import { ColumnHeaderDropdown } from '../ColumnHeaderDropdown';
import renderer from 'react-test-renderer';
import { Button } from '../../buttons';

jest.mock('react-dom', () => ({
    createPortal: jest.fn((element, node) => element),
    findDOMNode: jest.fn(),
}));

describe('ColumnHeaderDropdown', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<ColumnHeaderDropdown
                renderTarget={ props => <Button caption='Test' { ...props } /> }
                isOpen
                onOpenChange={ jest.fn }
                isSortable
                sortDirection='asc'
                onSort={ jest.fn }
                renderFilter={ () => <div>Picker</div> }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


