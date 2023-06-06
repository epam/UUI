import React from 'react';
import { renderer, mockReactPortalsForSnapshots } from '@epam/uui-test-utils';
import { Burger } from '../Burger';
import { BurgerButton } from '../BurgerButton';

describe('Burger', () => {
    it('should render with maximum props', () => {
        const { mockClear } = mockReactPortalsForSnapshots();
        const tree = renderer.create(<Burger width={ 160 } renderBurgerContent={ () => <BurgerButton caption="Home" link={ { pathname: '/' } } /> } />).toJSON();
        mockClear();
        expect(tree).toMatchSnapshot();
    });
});
