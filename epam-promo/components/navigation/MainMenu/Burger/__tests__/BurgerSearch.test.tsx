import React from 'react';
import { BurgerSearch } from '../BurgerSearch';
import renderer from 'react-test-renderer';
import * as calendarIcon from '../../../../../icons/calendar-18.svg';

describe('BurgerSearch', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<BurgerSearch
                value={ null }
                onValueChange={ () => {} }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<BurgerSearch
                value={ null }
                onValueChange={ () => {} }
                onAccept={ () => {} }
                onCancel={ () => {} }
                icon={ calendarIcon }
                iconPosition='right'
                isDropdown
                isOpen
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


