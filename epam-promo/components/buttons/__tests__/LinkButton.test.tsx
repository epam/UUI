import React from 'react';
import { LinkButton } from '../LinkButton';
import renderer from 'react-test-renderer';
import * as calendarIcon from '../../../icons/calendar-18.svg';

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
                color='blue'
                onClick={ jest.fn }
                icon={ calendarIcon }
                isDisabled={ false }
                isDropdown
                onClear={ jest.fn }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});