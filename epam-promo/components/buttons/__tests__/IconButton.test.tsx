import React from 'react';
import { IconButton } from '../IconButton';
import renderer from 'react-test-renderer';
import * as calendarIcon from '../../../icons/calendar-18.svg';

describe('IconButton', () => {
    it('should be rendered correctly', () => {

        const tree = renderer
            .create(<IconButton />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const tree = renderer
            .create(<IconButton
                color='blue'
                onClick={ jest.fn }
                icon={ calendarIcon }
                isDisabled={ false }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});