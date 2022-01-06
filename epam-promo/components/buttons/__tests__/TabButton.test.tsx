import React from 'react';
import { TabButton } from '../TabButton';
import renderer from 'react-test-renderer';
import { ReactComponent as CalendarIcon } from '../../../icons/calendar-18.svg';

describe('TabButton', () => {
    it('should be rendered correctly', () => {

        const tree = renderer
            .create(<TabButton />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {

        const tree = renderer
            .create(<TabButton
                onClick={ jest.fn }
                icon={ CalendarIcon }
                isDisabled={ false }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});