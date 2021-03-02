import React from 'react';
import renderer from 'react-test-renderer';
import { Burger } from '../Burger';
import { BurgerButton } from '../BurgerButton';

jest.mock('react-dom', () => ({
    createPortal: jest.fn(el => el),
}));

describe('Burger', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<Burger  width={ 160 }
                renderBurgerContent={ ({ onClose: {} }) => <BurgerButton caption='Home' link={ { pathname: '/' } } /> }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


