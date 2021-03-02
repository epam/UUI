import React from 'react';
import { Badge } from '../Badge';
import renderer from 'react-test-renderer';
import * as calendarIcon from '../../../icons/calendar-18.svg';

describe('Badge', () => {
    it('should be rendered correctly', () => {

        const tree = renderer
            .create(<Badge />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {

        const tree = renderer
            .create(<Badge
                caption='Test badge'
                fill='semitransparent'
                color='amber'
                icon={ calendarIcon }
                count={ 12 }
                onIconClick={ () => {} }
                onClick={ () => {} }
                onClear={ () => {} }
                size='36'
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

