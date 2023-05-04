import React from 'react';
import { Slider } from '../Slider';
import { renderer, mockReactPortalsForSnapshots } from '@epam/uui-test-utils';

describe('Slider', () => {
    it('should render with minimum props', () => {
        const { mockClear } = mockReactPortalsForSnapshots();
        const tree = renderer.create(<Slider value={ null } onValueChange={ jest.fn } min={ 0 } max={ 50 } step={ 1 } />).toJSON();
        mockClear();
        expect(tree).toMatchSnapshot();
    });

    it('should render with maximum props', () => {
        const { mockClear } = mockReactPortalsForSnapshots();
        const tree = renderer.create(<Slider value={ null } onValueChange={ jest.fn } min={ 0 } max={ 50 } step={ 1 } renderLabel={ (num) => `${num}` } />).toJSON();
        mockClear();
        expect(tree).toMatchSnapshot();
    });
});
