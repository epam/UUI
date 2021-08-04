import * as React from 'react';
import renderer from 'react-test-renderer';
import { RangeDatePickerBody } from '../RangeDatePickerBody';
import dayjs from 'dayjs';

describe('RangeDatePickerBody', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<RangeDatePickerBody
                value={ { view: 'DAY_SELECTION', selectedDate: { from: null, to: null }, displayedDate: dayjs('2020-09-03') } }
                focusPart={ 'from' }
                onValueChange={ jest.fn }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
