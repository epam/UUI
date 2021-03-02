import React from 'react';
import { DataTable } from '../DataTable';
import renderer from 'react-test-renderer';

jest.mock('react-dom', () => ({
    findDOMNode: jest.fn(),
}));

describe('DataTable', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<DataTable
                columns={ [] }
                getRows={ () => [] }
                value={ {} }
                onValueChange={ jest.fn }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


