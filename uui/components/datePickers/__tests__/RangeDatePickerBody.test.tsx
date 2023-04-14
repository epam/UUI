import * as React from 'react';
import renderer from 'react-test-renderer';
import type { RangeDatePickerValue, ViewType } from '@epam/uui-components';
import { RangeDatePickerBody } from '../RangeDatePickerBody';
import dayjs from 'dayjs';

describe('RangeDatePickerBody', () => {
    it('should be rendered correctly', () => {
        const displayedDate = dayjs('2020-09-03');
        const value = {
            view: 'DAY_SELECTION' as ViewType,
            selectedDate: {
                from: null,
                to: null,
            } as RangeDatePickerValue,
            displayedDate,
        };
        const tree = renderer
            .create(<RangeDatePickerBody
                value={ value }
                focusPart={ 'from' }
                onValueChange={ jest.fn }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
