import React from 'react';
import { LinkButton } from '../LinkButton';
import renderer from 'react-test-renderer';
import { ReactComponent as CalendarIcon } from '../../../icons/calendar-18.svg';

describe('LinkButton', () => {
    it('should be rendered correctly', () => {

        const tree = renderer
            .create(<LinkButton />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {

        const tree = renderer
            .create(<LinkButton
                onClick={ jest.fn }
                icon={ CalendarIcon }
                isDisabled={ false }
                isDropdown
                onClear={ jest.fn }
                size='30'
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});