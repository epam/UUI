import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import dayjs from 'dayjs';
import { DatePickerBody } from '../..';

describe('DatePickerBody', () => {
    let wrapper: ShallowWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;

    afterEach(() => {
        wrapper && wrapper.unmount();
    });


    it('should change selectedDate on day click', () => {
        let newState: any = {};
        wrapper = shallow(<DatePickerBody
            value={ {
                view: 'DAY_SELECTION',
                selectedDate: '',
                displayedDate: dayjs().startOf('day'),
            } }
            setSelectedDate={ (nV: any) => newState = { selectedDate: nV} }
            setDisplayedDateAndView={ (displayedDate, view) => {  } }
        />, {});
        (wrapper.instance() as any).onDayClick(dayjs("2017-01-22"));
        expect(newState.selectedDate).toEqual("2017-01-22");
    });
});
