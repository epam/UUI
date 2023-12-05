import React from 'react';
import { RadioInput, RadioInputProps } from '../RadioInput';
import { screen, setupComponentForTest } from '@epam/uui-test-utils';

async function setupRadioInput(params: Partial<RadioInputProps>) {
    const { mocks, setProps } = await setupComponentForTest<RadioInputProps>(
        (context) => ({
            value: params.value,
            onValueChange: params.onValueChange || jest.fn().mockImplementation((newValue) => {
                context.current.setProperty('value', newValue);
            }),
            ...params,
        }),
        (props) => {
            return <RadioInput { ...props } />;
        },
    );
    return {
        setProps,
        mocks,
    };
}

describe('RadioInput', () => {
    it('should call onValueChange when clicked', async () => {
        const onValueChange = jest.fn();
        await setupRadioInput({ value: false, onValueChange });
        const input = screen.getByRole('radio');
        input.click();
        expect(onValueChange).toHaveBeenCalledWith(true);
    });

    it('should not call onValueChange when clicked if isReadonly is true', async () => {
        const onValueChange = jest.fn();

        await setupRadioInput({ value: false, onValueChange, isReadonly: true });
        const input = screen.getByRole('radio');
        input.click();
        expect(onValueChange).not.toHaveBeenCalled();
    });

    it('should call getValueChangeAnalyticsEvent when clicked', async () => {
        const onValueChange = jest.fn();
        const getValueChangeAnalyticsEvent = jest.fn();

        await setupRadioInput({ value: false, onValueChange, getValueChangeAnalyticsEvent });
        const input = screen.getByRole('radio');
        input.click();
        expect(getValueChangeAnalyticsEvent).toHaveBeenCalled();
    });
});
