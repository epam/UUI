import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { DatePicker } from '..';
import moment from 'moment';
import { toCustomDateFormat, toValueDateFormat, valueFormat } from '@epam/uui-components';

describe('DataPicker', () => {
    let wrapper: ShallowWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;

    afterEach(() => {
        wrapper && wrapper.unmount();
    });

    it('should change input value after change props', () => {
        wrapper = shallow(<DatePicker
            format='MMM D, YYYY'
            value={ null }
            onValueChange={ () => { } }
        />, {});

        wrapper.setProps({ value: '2017-01-22' });
        expect(wrapper.state('inputValue')).toEqual('Jan 22, 2017');
        expect(wrapper.state('selectedDate')).toEqual('2017-01-22');
    });

    it('should render with default props', () => {
        wrapper = shallow(<DatePicker
            format='MMM D, YYYY'
            value={ null }
            onValueChange={ () => { } }
        />, {});

        expect(wrapper.isEmptyRender()).toBe(false);
    });

    it('should change state on picker clear', () => {
        let newState: any = {};
        wrapper = shallow(<DatePicker
            value={ null }
            onValueChange={ (nV: any) => newState = nV }
            format='MMM D, YYYY'
        />, {});
        (wrapper.instance() as any).handleCancel();
        expect(newState).toEqual(null);

    });

    it('should reset invalid value onBlur', () => {
        let baseValue = '2019-10-47';
        let newState: any = { inputValue: baseValue, value: baseValue };
        wrapper = shallow(<DatePicker
            value={ baseValue }
            onValueChange={ (nV: any) => newState.value = nV }
            format='MMM D, YYYY'
        />, {});

        (wrapper.instance() as any).handleBlur('from');
        expect(newState.value).toEqual(null);

    });

    it('should set new value', () => {
        let testValue = '2019-10-10';
        const inputFormat = 'DD-MM-YYYY';
        const inputTestValue = toCustomDateFormat(testValue, inputFormat);
        const displayedTestDate = moment(testValue);

        const onValueChangeSpy = jest.fn((nV: any) => null);
        const setStateSpy = jest.fn((nextState) => null);

        const pickerSetState = DatePicker.prototype.setState;
        DatePicker.prototype.setState = setStateSpy;

        wrapper = shallow(<DatePicker
            value={ null }
            onValueChange={ onValueChangeSpy }
            format={ inputFormat }
        />, {});
        const instance: any = wrapper.instance();

        instance.setSelectedDate(testValue);

        expect(onValueChangeSpy).toHaveBeenLastCalledWith(testValue);
        expect(setStateSpy).toHaveBeenLastCalledWith({
            inputValue: inputTestValue,
            selectedDate: testValue,
        });

        DatePicker.prototype.setState = pickerSetState;
    });

    it('should set new value when new value arrived from props', () => {
        let newValue = '2019-09-10';
        const defaultFormat = 'MMM D, YYYY';

        wrapper = shallow(<DatePicker
            value={ '' }
            onValueChange={ () => {} }
            format={ defaultFormat }
        />, {});
        const instance: any = wrapper.instance();

        wrapper.setProps({
            ...instance.props,
            value: newValue,
        });

        expect(instance.state.inputValue).toEqual('Sep 10, 2019');
    });

    it('should set isOpen on picker toggle', () => {
        let baseValue = '2019-10-47';
        let newState: any = { inputValue: baseValue, value: baseValue };
        wrapper = shallow(<DatePicker
            value={ baseValue }
            onValueChange={ (nV: any) => newState.value = nV }
            format="MMM D, YYYY"
        />, {});
        const instance: any = wrapper.instance();
        expect(instance.state.isOpen).toEqual(false);
        instance.onToggle(true);
        expect(instance.state.isOpen).toEqual(true);
        instance.onToggle(false);
        expect(instance.state.isOpen).toEqual(false);

    });

    it('should set new value when you type date in input', () => {
        let baseValue = '10-10-2019';
        const defaultFormat = 'DD-MM-YYYY';

        const onValueChangeSpy = jest.fn((nV: any) => null);
        const setStateSpy = jest.fn((nextState) => null);

        const pickerSetState = DatePicker.prototype.setState;
        DatePicker.prototype.setState = setStateSpy;

        wrapper = shallow(<DatePicker
            value={ null }
            onValueChange={ onValueChangeSpy }
            format={ defaultFormat }
        />, {});
        const instance: any = wrapper.instance();

        instance.handleInputChange(baseValue);

        expect(onValueChangeSpy).toHaveBeenLastCalledWith(toValueDateFormat(baseValue, defaultFormat));

        DatePicker.prototype.setState = pickerSetState;
    });

    it('should return format', () => {
        const defaultFormat = 'DD-MM-YYYY';

        wrapper = shallow(<DatePicker
            value={ null }
            onValueChange={ () => { } }
            format={ defaultFormat }
        />, {});
        const instance: any = wrapper.instance();
        let format = instance.getFormat();

        expect(format).toEqual('DD-MM-YYYY');
    });

    it('should get value', () => {
        const defaultFormat = 'DD-MM-YYYY';
        let baseValue = '2019-10-10';

        wrapper = shallow(<DatePicker
            value={ baseValue }
            onValueChange={ () => { } }
            format={ defaultFormat }
        />, {});
        const instance: any = wrapper.instance();

        let value = instance.getValue();

        expect(value).toEqual({
            selectedDate: baseValue,
            displayedDate: moment(baseValue, valueFormat),
            view: 'DAY_SELECTION',
        });
    });
});
