import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { RangeDatePicker } from '..';
import moment from 'moment';
import { toCustomDateRangeFormat, valueFormat } from '@epam/uui-components';

describe('RangeDataPicker', () => {
    let wrapper: ShallowWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;

    afterEach(() => {
        wrapper && wrapper.unmount();
    });

    it('should change input value after change props', () => {
        wrapper = shallow(<RangeDatePicker
            value={ null }
            onValueChange={ () => { } }
        />, {});

        wrapper.setProps({ value: { from: '2017-01-22', to: '2017-01-28' } });
        expect(wrapper.state('inputValue')).toEqual({ from: 'Jan 22, 2017', to: 'Jan 28, 2017' });
        expect(wrapper.state('selectedDate')).toEqual({ from: '2017-01-22', to: '2017-01-28' });
    });

    it('should render with default props', () => {

        wrapper = shallow(<RangeDatePicker
            value={ null }
            onValueChange={ () => { } }
        />, {});

        expect(wrapper.isEmptyRender()).toBe(false);
    });

    it('should change state on picker clear', () => {
        let newState: any = {};
        wrapper = shallow(<RangeDatePicker
            value={ null }
            onValueChange={ (nV: any) => newState = nV }
        />, {});
        (wrapper.instance() as any).onClear();
        expect(newState.from).toEqual(null);
        expect(newState.to).toEqual(null);

    });

    it('should reset invalid value onBlur', () => {
        let baseValue = { from: '2019-10-47', to: '2019-10-07' };
        const onValueChangeSpy = jest.fn((nV: any) => null);
        wrapper = shallow(<RangeDatePicker
            value={ baseValue }
            onValueChange={ onValueChangeSpy }
        />, {});

        (wrapper.instance() as any).handleBlur('from');
        expect(onValueChangeSpy).toHaveBeenLastCalledWith({
            from: null,
            to: baseValue.to,
        });
    });

    it('should set new value', () => {
        let baseValue = { from: '2019-09-10', to: '2019-09-12' };

        const onValueChangeSpy = jest.fn((nV: any) => null);
        const setStateSpy = jest.fn((nextState) => null);

        const pickerSetState = RangeDatePicker.prototype.setState;
        RangeDatePicker.prototype.setState = setStateSpy;

        wrapper = shallow(<RangeDatePicker
            value={ { from: null, to: null } }
            onValueChange={ onValueChangeSpy }
        />, {});
        const instance: any = wrapper.instance();

        instance.setValue({
            selectedDate: baseValue,
            displayedDate: baseValue.from,
            view: 'DAY_SELECTION',
        });

        expect(onValueChangeSpy).toHaveBeenLastCalledWith(baseValue);
        expect(setStateSpy).toHaveBeenLastCalledWith({
            isOpen: false,
            view: 'DAY_SELECTION',
            inFocus: null,
            inputValue: toCustomDateRangeFormat(baseValue, instance.getFormat()),
            selectedDate: baseValue,
            displayedDate: baseValue.from,
        });
        // arrived new value

        instance.setValue({
            selectedDate: { from: null, to: null },
            displayedDate: null,
            view: 'DAY_SELECTION',
        });

        expect(onValueChangeSpy).toHaveBeenCalledTimes(1);
        expect(setStateSpy).toHaveBeenLastCalledWith({
            isOpen: false,
            view: 'DAY_SELECTION',
            inFocus: null,
            inputValue: { from: null, to: null },
            selectedDate: { from: null, to: null },
            displayedDate: null,
        });
        //arrived the same value
        RangeDatePicker.prototype.setState = pickerSetState;
    });

    it('should set new value when new value typed in input', () => {
        let inputValue = { from: 'Sep 11, 2019', to: 'Sep 20, 2019' };
        let value = { from: '2019-09-14', to: '2019-09-15' };

        const setValueSpy = jest.fn((nV: any) => null);

        const pickerSetValue = RangeDatePicker.prototype.setValue;

        wrapper = shallow(<RangeDatePicker
            value={ value }
            onValueChange={ () => { } }
            format={ 'MMM D, YYYY' }
        />, {});
        const instance: any = wrapper.instance();
        instance.setValue = setValueSpy;

        instance.getChangeHandler('from')(inputValue.from);

        expect(setValueSpy).toHaveBeenLastCalledWith({
            view: 'DAY_SELECTION',
            selectedDate: { from: '2019-09-11', to: '2019-09-15' },
            displayedDate: moment(inputValue.from, 'MMM D, YYYY'),
        });
        //arrived valid value
        //
        // instance.getChangeHandler('from')(inputValue.to);
        //
        // expect(setValueSpy).toHaveBeenLastCalledWith({
        //     ...instance.state,
        //     inputValue: inputValue,
        //     selectedDate: { from: null, to: "2019-09-15" },
        // });
        // //arrived not valid value
        instance.setValue = pickerSetValue;
    });

    it('should set state to default on picker close', () => {
        let baseValue = { from: '2019-09-10', to: '2019-10-10' };

        const setStateSpy = jest.fn((nextState) => null);

        const pickerSetState = RangeDatePicker.prototype.setState;
        RangeDatePicker.prototype.setState = setStateSpy;

        wrapper = shallow(<RangeDatePicker
            value={ baseValue }
            onValueChange={ () => { } }
        />, {});
        const instance: any = wrapper.instance();

        instance.toggleOpening(false, 'from');

        expect(setStateSpy).toHaveBeenLastCalledWith({
            isOpen: false,
            view: 'DAY_SELECTION',
            displayedDate: moment(baseValue.from),
            inFocus: null,
        });

        RangeDatePicker.prototype.setState = pickerSetState;
    });

    it('should set null value on picker cancel', () => {
        let baseValue = { from: '2019-09-10', to: '2019-09-12' };

        const onValueChangeSpy = jest.fn((nV: any) => null);
        const setStateSpy = jest.fn((nextState) => null);

        const pickerSetState = RangeDatePicker.prototype.setState;
        RangeDatePicker.prototype.setState = setStateSpy;

        wrapper = shallow(<RangeDatePicker
            value={ baseValue }
            onValueChange={ onValueChangeSpy }
        />, {});
        const instance: any = wrapper.instance();

        instance.handleCancel();

        expect(onValueChangeSpy).toHaveBeenLastCalledWith({ from: null, to: null });
        expect(setStateSpy).toHaveBeenLastCalledWith({ inputValue: { from: null, to: null } });

        RangeDatePicker.prototype.setState = pickerSetState;
    });

    it('should get value', () => {
        let baseValue = { from: '2019-09-10', to: '2019-09-12' };

        wrapper = shallow(<RangeDatePicker
            value={ baseValue }
            onValueChange={ () => { } }
        />, {});
        const instance: any = wrapper.instance();

        let value = instance.getValue();

        expect(value).toEqual({
            selectedDate: baseValue,
            displayedDate: moment(baseValue.from, valueFormat),
            view: 'DAY_SELECTION',
        });
    });

    it('should change range on picker body value change', () => {
        let baseValue = { from: '2019-09-10', to: '2019-09-12' };
        let inputValue = { from: 'Sep 10, 2019', to: 'Sep 12, 2019' };

        const setValueSpy = jest.fn((nV: any) => null);
        const focusSpy = jest.fn((nV: any) => null);
        const pickerSetValue = RangeDatePicker.prototype.setValue;

        wrapper = shallow(<RangeDatePicker
            value={ { from: null, to: null } }
            onValueChange={ () => { } }
        />, {});
        const instance: any = wrapper.instance();
        instance.setValue = setValueSpy;
        wrapper.setState({ inFocus: 'from' });

        instance.onRangeChange({
            displayedDate: inputValue,
            selectedDate: baseValue,
            view: 'DAY_SELECTION',
        });

        expect(setValueSpy).toHaveBeenLastCalledWith({
            displayedDate: inputValue,
            selectedDate: baseValue,
            view: 'DAY_SELECTION',
        });
        expect(instance.state.inFocus).toEqual('to');
        //arrived new value

        wrapper.setProps({ value: {
            displayedDate: inputValue,
            selectedDate: baseValue,
            view: 'DAY_SELECTION',
        } });
        instance.handleCancel();

        instance.onRangeChange({
            displayedDate: inputValue,
            selectedDate: baseValue,
            view: 'DAY_SELECTION',
        });

        expect(setValueSpy).toHaveBeenLastCalledWith({
            displayedDate: inputValue,
            selectedDate: baseValue,
            view: 'DAY_SELECTION',
        });
        expect(instance.state.inFocus).toEqual('to');
        //arrived same value


        instance.setValue = pickerSetValue;
    });

    it('should return format', () => {
        wrapper = shallow(<RangeDatePicker
            value={ { from: null, to: null } }
            onValueChange={ () => { } }
        />, {});
        const instance: any = wrapper.instance();
        let format = instance.getFormat();

        expect(format).toEqual('MMM D, YYYY');
        //return default format
        wrapper.setProps({ format: 'DD-MM-YYYY' });
        format = instance.getFormat();

        expect(format).toEqual('DD-MM-YYYY');
        //return format from props
    });

    it('should set the same value on from: & to: input', () => {
        let baseValue = { from: '2019-09-10', to: '2019-09-10' };

        const onValueChangeSpy = jest.fn((nV: any) => null);
        const setStateSpy = jest.fn((nextState) => null);

        const pickerSetState = RangeDatePicker.prototype.setState;
        RangeDatePicker.prototype.setState = setStateSpy;

        wrapper = shallow(<RangeDatePicker
            value={ { from: null, to: null } }
            onValueChange={ onValueChangeSpy }
        />, {});
        const instance: any = wrapper.instance();

        instance.setValue({
            displayedDate: baseValue.from,
            selectedDate: { from: baseValue.from, to: null },
            view: 'DAY_SELECTION',
        });

        expect(onValueChangeSpy).toHaveBeenLastCalledWith({ from: baseValue.from, to: null });
        expect(setStateSpy).toHaveBeenLastCalledWith({
            isOpen: false,
            view: 'DAY_SELECTION',
            inFocus: null,
            inputValue: toCustomDateRangeFormat({ from: baseValue.from, to: null }, instance.getFormat()),
            selectedDate: { from: baseValue.from, to: null },
            displayedDate: baseValue.from,
        });

        instance.setValue({
            displayedDate: baseValue.to,
            selectedDate: baseValue,
            view: 'DAY_SELECTION',
        });

        expect(onValueChangeSpy).toHaveBeenLastCalledWith(baseValue);
        expect(setStateSpy).toHaveBeenLastCalledWith({
            isOpen: false,
            view: 'DAY_SELECTION',
            inFocus: null,
            inputValue: toCustomDateRangeFormat(baseValue, instance.getFormat()),
            selectedDate: baseValue,
            displayedDate: baseValue.to,
        });

        RangeDatePicker.prototype.setState = pickerSetState;
    });
});


