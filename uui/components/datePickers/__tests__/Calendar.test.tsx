import React from 'react';
import { Calendar } from '../Calendar';
import { renderer } from '@epam/uui-test-utils';
import { dayjs } from '../../../helpers/dayJsHelper';

describe('Calendar', () => {
    it('should be rendered correctly', () => {
        const tree = renderer.create(
            <Calendar
                value={ dayjs('2020-09-03') }
                onValueChange={ jest.fn }
                month={ dayjs('2020-09-03') }
            />,
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
