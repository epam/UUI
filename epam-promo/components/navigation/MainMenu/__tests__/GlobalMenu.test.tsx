import React from 'react';
import renderer from 'react-test-renderer';
import { GlobalMenu } from '../GlobalMenu';

describe('GlobalMenu', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<GlobalMenu />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


