import React from 'react';
import { TimePicker, TimePickerProps } from '../timePicker';
import { renderSnapshotWithContextAsync, screen, setupComponentForTest, fireEvent } from '@epam/uui-test-utils';

async function setupTestComponent(params: Partial<TimePickerProps>) {
    const { mocks, setProps } = await setupComponentForTest<TimePickerProps>(
        (context) => ({
            value: params.value,
            format: params.format,
            onValueChange: jest.fn().mockImplementation((newValue) => {
                context.current.setProperty('value', newValue);
            }),
        }),
        (props) => <TimePicker { ...props } />,
    );
    const input = screen.queryByRole('textbox') as HTMLInputElement;
    const dom = { input };
    return {
        setProps,
        mocks,
        dom,
    };
}

describe('TimePicker', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<TimePicker value={ null } onValueChange={ jest.fn } />);

        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with full props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <TimePicker value={ { hours: 1, minutes: 5 } } onValueChange={ jest.fn } format={ 24 } minutesStep={ 5 } size="36" isDisabled />,
        );

        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with disableClear property', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <TimePicker value={ { hours: 1, minutes: 5 } } onValueChange={ jest.fn } format={ 24 } minutesStep={ 5 } size="36" disableClear={ true } />,
        );

        expect(tree).toMatchSnapshot();
    });

    it('should set a value', async () => {
        const { dom } = await setupTestComponent({ value: null });
        expect(dom.input.value).toEqual('');
        fireEvent.change(dom.input, { target: { value: '12 23pm' } });
        expect(dom.input.value).toEqual('12 23pm');
        fireEvent.blur(dom.input);
        expect(dom.input.value).toEqual('12:23 PM');
    });

    it('should set a right value #1', async () => {
        const { dom } = await setupTestComponent({ value: { hours: 1, minutes: 10 }, format: 24 });
        expect(dom.input.value).toEqual('01:10');
        fireEvent.change(dom.input, { target: { value: '.35' } });
        expect(dom.input.value).toEqual('.35');
        fireEvent.blur(dom.input);
        expect(dom.input.value).toEqual('00:35');
    });

    it('should set a right value #2', async () => {
        const { dom } = await setupTestComponent({ value: { hours: 18, minutes: 23 }, format: 24 });
        expect(dom.input.value).toEqual('18:23');
        fireEvent.change(dom.input, { target: { value: '1930' } });
        expect(dom.input.value).toEqual('1930');
        fireEvent.blur(dom.input);
        expect(dom.input.value).toEqual('19:30');
    });

    it('should set a right value #3', async () => {
        const { dom } = await setupTestComponent({ value: null });
        expect(dom.input.value).toEqual('');
        fireEvent.change(dom.input, { target: { value: '3hgfh' } });
        expect(dom.input.value).toEqual('3hgfh');
        fireEvent.blur(dom.input);
        expect(dom.input.value).toEqual('03:00 AM');
    });

    it('should set a right value #4', async () => {
        const { dom } = await setupTestComponent({ value: { hours: 11, minutes: 23 }, format: 24 });
        expect(dom.input.value).toEqual('11:23');
        fireEvent.change(dom.input, { target: { value: '2/34' } });
        expect(dom.input.value).toEqual('2/34');
        fireEvent.blur(dom.input);
        expect(dom.input.value).toEqual('02:34');
    });

    it('should set a right value #5', async () => {
        const { dom } = await setupTestComponent({ value: { hours: 11, minutes: 23 }, format: 24 });
        expect(dom.input.value).toEqual('11:23');
        fireEvent.change(dom.input, { target: { value: '23/4' } });
        expect(dom.input.value).toEqual('23/4');
        fireEvent.blur(dom.input);
        expect(dom.input.value).toEqual('23:04');
    });

    it('should set a right value #6', async () => {
        const { dom } = await setupTestComponent({ value: { hours: 11, minutes: 23 }, format: 24 });
        expect(dom.input.value).toEqual('11:23');
        fireEvent.change(dom.input, { target: { value: '234' } });
        expect(dom.input.value).toEqual('234');
        fireEvent.blur(dom.input);
        expect(dom.input.value).toEqual('23:04');
    });

    it('should set a right value #7', async () => {
        const { dom } = await setupTestComponent({ value: { hours: 11, minutes: 23 }, format: 24 });
        expect(dom.input.value).toEqual('11:23');
        fireEvent.change(dom.input, { target: { value: '2349' } });
        expect(dom.input.value).toEqual('2349');
        fireEvent.blur(dom.input);
        expect(dom.input.value).toEqual('23:49');
    });

    it('should set a right value #8', async () => {
        const { dom } = await setupTestComponent({ value: null });
        expect(dom.input.value).toEqual('');
        fireEvent.change(dom.input, { target: { value: '5hgfhpm' } });
        expect(dom.input.value).toEqual('5hgfhpm');
        fireEvent.blur(dom.input);
        expect(dom.input.value).toEqual('05:00 PM');
    });

    it('should set a right value #9', async () => {
        const { dom } = await setupTestComponent({ value: { hours: 11, minutes: 23 }, format: 24 });
        expect(dom.input.value).toEqual('11:23');
        fireEvent.change(dom.input, { target: { value: '0000' } });
        expect(dom.input.value).toEqual('0000');
        fireEvent.blur(dom.input);
        expect(dom.input.value).toEqual('00:00');
    });

    it('should reset invalid value onBlur', async () => {
        const { dom } = await setupTestComponent({ value: { hours: 18, minutes: 23 } });
        expect(dom.input.value).toEqual('06:23 PM');
        fireEvent.change(dom.input, { target: { value: 'fhghg' } });
        expect(dom.input.value).toEqual('fhghg');
        fireEvent.blur(dom.input);
        expect(dom.input.value).toEqual('06:23 PM');
    });

    it('should clear input when clear button is clicked', async () => {
        const { dom, mocks } = await setupTestComponent({ value: { hours: 18, minutes: 23 } });
        const clear = screen.getByRole<HTMLButtonElement>('button');
        expect(dom.input.value).toEqual('06:23 PM');
        fireEvent.click(clear);
        expect(dom.input.value).toEqual('');
        expect(mocks.onValueChange).toHaveBeenCalledWith(null);
    });

    it('should increase and decrease hours when icon-button-up/down is clicked', async () => {
        const { dom } = await setupTestComponent({ value: { hours: 18, minutes: 23 } });
        expect(dom.input.value).toEqual('06:23 PM');
        fireEvent.click(dom.input);
        const picker = await screen.findByRole('dialog');
        expect(picker).toBeDefined();

        const increaseHoursButton = screen.getByLabelText('Increment hours');
        fireEvent.click(increaseHoursButton);
        expect(dom.input.value).toEqual('07:23 PM');
        const decreaseHoursButton = screen.getByLabelText('Decrement hours');
        fireEvent.click(decreaseHoursButton);
        expect(dom.input.value).toEqual('06:23 PM');
    });

    it('should increase and decrease minutes when icon-button-up/down is clicked', async () => {
        const { dom, setProps } = await setupTestComponent({ value: { hours: 18, minutes: 23 } });
        expect(dom.input.value).toEqual('06:23 PM');
        fireEvent.click(dom.input);
        const picker = await screen.findByRole('dialog');
        expect(picker).toBeDefined();

        setProps({ minutesStep: 1 });
        const increaseMinutesButton = screen.getByLabelText('Increment minutes');
        fireEvent.click(increaseMinutesButton);
        expect(dom.input.value).toEqual('06:24 PM');
        const decreaseMinutesButton = screen.getByLabelText('Decrement minutes');
        fireEvent.click(decreaseMinutesButton);
        expect(dom.input.value).toEqual('06:23 PM');
    });
});
