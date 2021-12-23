import React from 'react';
import { TextInput } from '../TextInput';
import renderer from 'react-test-renderer';
import { ReactComponent as CalendarIcon } from '../../../icons/calendar-18.svg';

describe('TextInput', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<TextInput
                value={ null }
                onValueChange={ jest.fn }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<TextInput
                value={ null }
                onValueChange={ jest.fn }
                onAccept={ jest.fn }
                onCancel={ jest.fn }
                icon={ CalendarIcon }
                iconPosition='right'
                size='36'
                isDropdown
                isOpen
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


