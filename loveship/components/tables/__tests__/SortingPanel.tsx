import React from 'react';
import renderer from 'react-test-renderer';
import { SortingPanel } from '../ColumnHeaderDropdown/SortingPanel';

describe('SortingPanel', () => {
    it('should be rendered correctly with asc direction', () => {
        const tree = renderer.create(<SortingPanel sortDirection={'asc'} onSort={jest.fn()} />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with desc direction', () => {
        const tree = renderer.create(<SortingPanel sortDirection={'desc'} onSort={jest.fn()} />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
