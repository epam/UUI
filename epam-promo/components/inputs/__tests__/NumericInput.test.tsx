import React from 'react';
import { NumericInput } from '../NumericInput';
import renderer from 'react-test-renderer';

describe('NumericInput', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<NumericInput
                value={ null }
                onValueChange={ jest.fn }
                min={ 0 }
                max={ 50 }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<NumericInput
                value={ null }
                onValueChange={ jest.fn }
                min={ 0 }
                max={ 50 }
                size='36'
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


