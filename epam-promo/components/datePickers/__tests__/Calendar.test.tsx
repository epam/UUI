import React from 'react';
import { Calendar } from '../Calendar';
import renderer from 'react-test-renderer';
import moment from 'moment';

describe('Calendar', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<Calendar
                value={ moment('2020-09-03') }
                onValueChange={ jest.fn }
                displayedDate={ moment('2020-09-03') }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});