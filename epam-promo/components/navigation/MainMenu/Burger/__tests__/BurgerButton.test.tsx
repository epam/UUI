import React from 'react';
import { BurgerButton } from '../BurgerButton';
import renderer from 'react-test-renderer';
import * as calendarIcon from '../../../../../icons/calendar-18.svg';

describe('BurgerButton', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<BurgerButton />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<BurgerButton
                caption='Test button'
                icon={ calendarIcon }
                href={ '#' }
                target='_blank'
                type='secondary'
                isDropdown
                isOpen={ false }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


