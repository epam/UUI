import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import moment from 'moment';
import {PickerBodyValue, RangeDatePickerBody, RangeDatePickerValue} from '../..';



describe('DatePickerBody', () => {
    let wrapper: ShallowWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;

    afterEach(() => {
        wrapper && wrapper.unmount();
    });

    it('dummy test', () => expect(true).toBe(true));

    it('should return valid range', () => {
        let baseValue = { from: '2019-10-12', to: '2019-10-17' };
        let newState: any = {};

        wrapper = shallow(<RangeDatePickerBody
            value={ {
                view: 'DAY_SELECTION',
                selectedDate: { from: null, to: null },
                displayedDate: moment().startOf('day'),
            } }
            onValueChange={ (nV: any) => newState = nV }
            focusPart={ 'from' }
        />, {});

        let range = (wrapper.instance() as any).getRange(baseValue.from);
        expect(range).toEqual({
            from: baseValue.from,
            to: null,
        });
        //return range when select from value
        wrapper.setProps({ focusPart: 'to' });

        range = (wrapper.instance() as any).getRange(baseValue.to);
        expect(range).toEqual({
            from: null,
            to: baseValue.to,
        });
        //return range when select to value

        wrapper.setProps({
            value: {
                view: 'DAY_SELECTION',
                selectedDate: baseValue,
                displayedDate: moment().startOf('day'),
            },
        });

        let newValue = '2019-10-25';
        range = (wrapper.instance() as any).getRange(newValue);

        expect(range).toEqual({
            from: baseValue.from,
            to: newValue,
        });
        //return full selected range
        wrapper.setProps({ focusPart: 'from' });
        range = (wrapper.instance() as any).getRange(newValue);

        expect(range).toEqual({
            from: newValue,
            to: null,
        });
        //return range when selected not valid value
    });

    it('should set new date', () => {
        let baseValue = { from: '2019-09-10', to: '2019-09-12' };

        const onValueChangeSpy = jest.fn((nV: any) => null);
        const setStateSpy = jest.fn((nextState) => null);

        const pickerSetState = RangeDatePickerBody.prototype.setState;
        RangeDatePickerBody.prototype.setState = setStateSpy;

        const defaultValue: PickerBodyValue<RangeDatePickerValue> = {
            view: 'DAY_SELECTION',
            selectedDate: { from: null, to: null },
            displayedDate: moment().startOf('day'),
        };

        wrapper = shallow(<RangeDatePickerBody
            value={ defaultValue }
            onValueChange={ onValueChangeSpy }
            focusPart={ 'from' }
        />, {});
        const instance: any = wrapper.instance();

        instance.setSelectedDate(baseValue.from);

        //set from value
        expect(onValueChangeSpy).toHaveBeenLastCalledWith({
            ...defaultValue,
            selectedDate: {
                from: baseValue.from,
                to: null,
            },
        });

        //set to value
        instance.setSelectedDate(baseValue.to);

        expect(onValueChangeSpy).toHaveBeenLastCalledWith({
            ...defaultValue,
            selectedDate: {
                from: baseValue.to,
                to: null,
            },
        });

        RangeDatePickerBody.prototype.setState = pickerSetState;
    });

    it('should set new displayedDate and view', () => {
        const setStateSpy = jest.fn((nextState) => null);
        const onValueChangeSpy = jest.fn((nV: any) => null);


        const pickerSetState = RangeDatePickerBody.prototype.setState;
        RangeDatePickerBody.prototype.setState = setStateSpy;

        const defaultValue: PickerBodyValue<RangeDatePickerValue> = {
            view: 'DAY_SELECTION',
            selectedDate: { from: null, to: null },
            displayedDate: moment().startOf('day'),
        };

        wrapper = shallow(<RangeDatePickerBody
            value={ defaultValue }
            onValueChange={ onValueChangeSpy }
            focusPart={ 'from' }
        />, {});
        const instance: any = wrapper.instance();

        //set from value
        instance.setDisplayedDateAndView(moment("09-25-2020", "MM-DD-YYYY"), 'MONTH_SELECTION', 'from');

        expect(onValueChangeSpy).toHaveBeenLastCalledWith({
            ...defaultValue,
            displayedDate: moment("09-25-2020", "MM-DD-YYYY"),
            view: 'MONTH_SELECTION',
        });
        expect(setStateSpy).toHaveBeenCalledWith({ activePart: 'from'});

        //set to value
        instance.setDisplayedDateAndView(moment("09-25-2020", "MM-DD-YYYY"), 'YEAR_SELECTION', 'to');

        expect(onValueChangeSpy).toHaveBeenLastCalledWith({
            ...defaultValue,
            displayedDate: moment("09-25-2020", "MM-DD-YYYY").subtract(1, 'months'),
            view: 'YEAR_SELECTION',
        });
        expect(setStateSpy).toHaveBeenCalledWith({activePart: 'to'});


        RangeDatePickerBody.prototype.setState = pickerSetState;
    });

    it('should get styles', () => {
        let baseValue = { from: '2019-09-10', to: '2019-09-12' };

        wrapper = shallow(<RangeDatePickerBody
            value={ {
                view: 'DAY_SELECTION',
                selectedDate: { from: null, to: null },
                displayedDate: moment().startOf('day'),
            } }
            onValueChange={ () => { } }
            focusPart={ 'from' }
        />, {});
        const instance: any = wrapper.instance();

        let styles = instance.getDayCX(moment(baseValue.from));

        expect(styles).toEqual([false, false, false, false, false, false]);
        //get styles when date does not selected

        wrapper.setProps({ value: { selectedDate: baseValue } });
        styles = instance.getDayCX(moment(baseValue.from));
        expect(styles).toEqual([
            "uui-range-datepicker-in-range",
            "uui-range-datepicker-first-day-in-range-wrapper",
            false,
            false,
            false,
            "uui-calendar-selected-day",
        ]);
        //get styles for first date

        styles = instance.getDayCX(moment(baseValue.to));
        expect(styles).toEqual([
            "uui-range-datepicker-in-range",
            false,
            false,
            "uui-range-datepicker-last-day-in-range-wrapper",
            false,
            "uui-calendar-selected-day",
        ]);
        //get styles for last date;
    });

    it('should get from value', () => {
        let baseValue = { from: '2019-09-10', to: '2019-09-12' };

        wrapper = shallow(<RangeDatePickerBody
            value={ {
                view: 'DAY_SELECTION',
                selectedDate: baseValue,
                displayedDate: moment().startOf('day'),
            } }
            onValueChange={ () => { } }
            focusPart={ 'from' }
        />, {});
        const instance: any = wrapper.instance();

        let fromValue = instance.getFromValue();

        expect(fromValue).toEqual({
            view: 'DAY_SELECTION',
            displayedDate: moment().startOf('day'),
            selectedDate: '2019-09-10',
        });

    });

    it('should get to value', () => {
        let baseValue = { from: '2019-09-10', to: '2019-09-12' };

        wrapper = shallow(<RangeDatePickerBody
            value={ {
                view: 'DAY_SELECTION',
                selectedDate: baseValue,
                displayedDate: moment().startOf('day'),
            } }
            onValueChange={ () => { } }
            focusPart={ 'from' }
        />, {});
        const instance: any = wrapper.instance();

        let fromValue = instance.getToValue();

        expect(fromValue).toEqual({
            view: 'DAY_SELECTION',
            selectedDate: '2019-09-12',
            displayedDate: moment().startOf('day').add(1, 'months'),
        });

    });
});
