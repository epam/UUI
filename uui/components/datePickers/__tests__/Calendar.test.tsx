import React from 'react';
import { Calendar } from '../Calendar';
import renderer from 'react-test-renderer';
import dayjs from 'dayjs';

describe('Calendar', () => {
    it('should be rendered correctly', () => {
        const tree = renderer.create(<Calendar value={ dayjs('2020-09-03') } onValueChange={ jest.fn } displayedDate={ dayjs('2020-09-03') } />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
