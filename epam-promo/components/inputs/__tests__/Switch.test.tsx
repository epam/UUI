import React from 'react';
import { Switch } from '../Switch';
import renderer from 'react-test-renderer';

describe('Switch', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<Switch
                value={ null }
                onValueChange={ jest.fn }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<Switch
                value={ null }
                onValueChange={ jest.fn }
                size='18'
                label='Open'
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


