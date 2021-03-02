import React from 'react';
import { VirtualList } from '../VirtualList';
import renderer from 'react-test-renderer';

jest.mock('react-dom', () => ({
    findDOMNode: jest.fn(),
}));

describe('VirtualList', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<VirtualList
                rows={ null }
                value={ null }
                onValueChange={ () => {} }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});