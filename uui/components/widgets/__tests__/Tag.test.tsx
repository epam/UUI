import React from 'react';
import { Tag } from '../Tag';
import renderer from 'react-test-renderer';
import { ReactComponent as CalendarIcon } from '../../../icons/calendar-18.svg';

describe('Tag', () => {
    it('should be rendered correctly', () => {
        const tree = renderer.create(<Tag />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const tree = renderer
            .create(<Tag caption="Test badge" icon={ CalendarIcon } count={ 12 } onIconClick={ () => {} } onClick={ () => {} } onClear={ () => {} } size="36" />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
