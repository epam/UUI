import React from 'react';
import { IconButton } from '../IconButton';
import renderer from 'react-test-renderer';
import { ReactComponent as CalendarIcon } from "../../../icons/calendar-18.svg";

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
                color='info'
                onClick={ jest.fn }
                icon={ CalendarIcon }
                isDisabled={ false }

            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});