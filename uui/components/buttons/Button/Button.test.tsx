import React from 'react';
import { Button } from './Button';
import renderer from 'react-test-renderer';
import { ReactComponent as CalendarIcon } from '../../../icons/calendar-18.svg';
import { ReactComponent as ClearIcon } from '@epam/assets/icons/common/navigation-close-18.svg';


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
                color='accent'
                mode='outline'
                caption='Click me'
                onClick={ jest.fn }
                icon={ CalendarIcon }
                isDisabled={ false }
                isDropdown={ true }
                count={ 10 }
                iconPosition='right'
                onClear={ jest.fn }
                isOpen
                clearIcon={ ClearIcon }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});