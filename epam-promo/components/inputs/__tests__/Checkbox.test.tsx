import React from 'react';
import { Checkbox } from '../Checkbox';
import renderer from 'react-test-renderer';

describe('Checkbox', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<Checkbox
                value={ null }
                onValueChange={ jest.fn }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<Checkbox
                value={ null }
                onValueChange={ jest.fn }
                size='18'
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


