import React from 'react';
import { Button } from '../Button';
import renderer from 'react-test-renderer';
import * as calendarIcon from '../../../icons/calendar-18.svg';
import * as clearIcon from '@epam/assets/icons/common/navigation-close-18.svg';


describe('Button', () => {
    it('should be rendered correctly', () => {

        const tree = renderer
            .create(<Button />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {

        const tree = renderer
            .create(<Button
                color='blue'
                fill='white'
                caption='Click me'
                onClick={ jest.fn }
                icon={ calendarIcon }
                isDisabled={ false }
                isDropdown={ true }
                count={ 10 }
                iconPosition='right'
                onClear={ jest.fn }
                isOpen
                clearIcon={ clearIcon }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});