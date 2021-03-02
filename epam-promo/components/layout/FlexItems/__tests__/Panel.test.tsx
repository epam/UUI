import React from 'react';
import { Panel } from '../Panel';
import renderer from 'react-test-renderer';

describe('Panel', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<Panel />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const tree = renderer
            .create(<Panel
                onClick={ () => {} }
                background='white'
                margin='24'
                shadow
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});