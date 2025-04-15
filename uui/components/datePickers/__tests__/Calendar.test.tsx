import React from 'react';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { Calendar } from '../Calendar';
import dayjs from 'dayjs';

describe('Calendar', () => {
    it('should be rendered correctly', () => {
        const tree = renderSnapshotWithContextAsync(
            <Calendar
                value={ dayjs('2020-09-03') }
                onValueChange={ jest.fn }
                month={ dayjs('2020-09-03') }
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});
