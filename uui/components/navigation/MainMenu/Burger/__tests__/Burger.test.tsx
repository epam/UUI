import React from 'react';
import { render, mockReactPortalsForSnapshots } from '@epam/uui-test-utils';
import { Burger } from '../Burger';
import { BurgerButton } from '../BurgerButton';

describe('Burger', () => {
    it('should render with maximum props', () => {
        const { mockClear } = mockReactPortalsForSnapshots();
        const { asFragment } = render(<Burger width={ 160 } renderBurgerContent={ () => <BurgerButton caption="Home" link={ { pathname: '/' } } /> } />);
        mockClear();
        expect(asFragment()).toMatchSnapshot();
    });
});
