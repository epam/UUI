import React from 'react';
import { Checkbox, CheckboxProps } from '../Checkbox';
import { screen, fireEvent, setupComponentForTest, userEvent } from '@epam/uui-test-utils';

async function setupCheckbox(params: Partial<CheckboxProps>) {
    const { mocks, setProps } = await setupComponentForTest<CheckboxProps>(
        (context) => ({
            value: params.value,
            onValueChange: params.onValueChange || jest.fn().mockImplementation((newValue) => {
                context.current.setProperty('value', newValue);
            }),
            ...params,
        }),
        (props) => {
            return <Checkbox { ...props } />;
        },
    );
    return {
        setProps,
        mocks,
    };
}

describe('Checkbox', () => {
    it('should handle change event', async () => {
        const onValueChange = jest.fn();
        const getValueChangeAnalyticsEvent = jest.fn();
        await setupCheckbox({
            value: false,
            onValueChange,
            getValueChangeAnalyticsEvent,
        });
        const input = screen.getByRole('checkbox');

        fireEvent.click(input);

        expect(onValueChange).toHaveBeenCalledWith(true);
        expect(getValueChangeAnalyticsEvent).toHaveBeenCalled();
    });

    it('should handle keyboard click', async () => {
        const onValueChange = jest.fn();
        const getValueChangeAnalyticsEvent = jest.fn();
        await setupCheckbox({
            value: false,
            onValueChange,
            getValueChangeAnalyticsEvent,
        });
        const input = screen.getByRole('checkbox');

        await userEvent.type(input, '{space}');

        expect(onValueChange).toHaveBeenCalledWith(true);
        expect(getValueChangeAnalyticsEvent).toHaveBeenCalled();
    });

    it('should handle label click', async () => {
        const onValueChange = jest.fn();
        const getValueChangeAnalyticsEvent = jest.fn();
        await setupCheckbox({
            value: false,
            onValueChange,
            getValueChangeAnalyticsEvent,
            label: 'Label',
        });
        const label = screen.getByText('Label');

        label.click();

        expect(onValueChange).toHaveBeenCalledWith(true);
        expect(getValueChangeAnalyticsEvent).toHaveBeenCalled();
    });

    it('should not handle change event when readonly', async () => {
        const onValueChange = jest.fn();
        await setupCheckbox({
            value: false,
            onValueChange,
            isReadonly: true,
            label: 'Label',
        });
        const input = screen.getByRole('checkbox');

        fireEvent.click(input);
        expect(onValueChange).not.toHaveBeenCalled();
    });

    it('should handle focus event', async () => {
        const onFocus = jest.fn();
        const onValueChange = jest.fn();
        await setupCheckbox({
            value: false,
            onValueChange,
            label: 'Label',
            onFocus,
        });
        const input = screen.getByRole('checkbox');

        input.focus();

        expect(onFocus).toHaveBeenCalled();
        expect(input).toHaveFocus();
    });

    it('should handle blur event', async () => {
        const onBlur = jest.fn();
        const onValueChange = jest.fn();
        await setupCheckbox({
            value: false,
            onValueChange,
            label: 'Label',
            onBlur,
        });
        const input = screen.getByRole('checkbox');

        input.focus();
        expect(input).toHaveFocus();
        input.blur();

        expect(onBlur).toHaveBeenCalled();
        expect(input).not.toHaveFocus();
    });
});
