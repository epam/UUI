import React from 'react';
import renderer from 'react-test-renderer';
import { IconContainer } from '../IconContainer';
import { ReactComponent as CalendarIcon } from '../../../icons/calendar-18.svg';

describe('IconContainer', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<IconContainer
                icon={ CalendarIcon }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const tree = renderer
            .create(<IconContainer
                color='blue'
                onClick={ () => null }
                icon={ CalendarIcon }
                size={ 36 }
                rotate='90ccw'
                tabIndex={ 0 }
                flipY
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});