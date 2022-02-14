import React from 'react';
import renderer from 'react-test-renderer';
import { windowMock } from "@epam/test-utils";
import { Button } from '../../buttons';
import { ColumnHeaderDropdown } from '../ColumnHeaderDropdown';

jest.mock('react-dom', () => ({
    createPortal: jest.fn((element, node) => element),
}));

describe('ColumnHeaderDropdown', () => {
    beforeEach(() => {
        jest.spyOn(window, "window", "get")
            .mockImplementation(() => windowMock);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<ColumnHeaderDropdown
                title=""
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


