import * as React from 'react';
import renderer from 'react-test-renderer';
import { RangeDatePickerBody } from '../RangeDatePickerBody';
import moment from 'moment';

describe('RangeDatePickerBody', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<RangeDatePickerBody
                value={ { view: 'DAY_SELECTION', selectedDate: { from: null, to: null }, displayedDate: moment('2020-09-03') } }
                focusPart={ 'from' }
                onValueChange={ jest.fn }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
