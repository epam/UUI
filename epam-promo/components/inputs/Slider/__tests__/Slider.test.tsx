import React from 'react';
import { Slider } from '../Slider';
import renderer from 'react-test-renderer';

jest.mock('react-dom', () => ({
    createPortal: jest.fn((element, node) => element),
}));

describe('Slider', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<Slider
                value={ null }
                onValueChange={ jest.fn }
                min={ 0 }
                max={ 50 }
                step={ 1 }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<Slider
                value={ null }
                onValueChange={ jest.fn }
                min={ 0 }
                max={ 50 }
                step={ 1 }
                renderLabel={ (num) => `${ num }` }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
