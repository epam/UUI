import * as React from 'react';
import { fireEvent, setupComponentForTest, screen, userEvent } from '@epam/uui-test-utils';
import { Switch, SwitchProps } from '../Switch';

async function setupSwitch(params: Partial<SwitchProps>) {
    const { mocks, setProps } = await setupComponentForTest<SwitchProps>(
        (context) => ({
            value: params.value,
            onValueChange: params.onValueChange || jest.fn().mockImplementation((newValue) => {
                context.current.setProperty('value', newValue);
            }),
            ...params,
        }),
        (props) => {
            return <Switch { ...props } />;
        },
    );
    return {
        setProps,
        mocks,
    };
}

describe('Switch', () => {
    it('should render Switch component', async () => {
        await setupSwitch({ label: 'Test Switch' });
        const switchElement = screen.getByLabelText('Test Switch');

        expect(switchElement).toBeInTheDocument();
    });

    it('should toggle switch when clicked', async () => {
        await setupSwitch({ label: 'Test Switch' });
        const switchElement: HTMLInputElement = screen.getByLabelText('Test Switch');

        fireEvent.click(switchElement);

        expect(switchElement.checked).toBe(true);
    });

    it('should toggle switch on keyboard click', async () => {
        await setupSwitch({ label: 'Test Switch' });
        const switchElement: HTMLInputElement = screen.getByLabelText('Test Switch');

        await userEvent.type(switchElement, '{space}');

        expect(switchElement.checked).toBe(true);
    });

    it('should call onChange handler when the switch is toggled', async () => {
        const handleChange = jest.fn();
        await setupSwitch({ label: 'Test Switch', onValueChange: handleChange });
        const switchElement = screen.getByLabelText('Test Switch');

        fireEvent.click(switchElement);

        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('should call getValueChangeAnalyticsEvent handler when the switch is toggled', async () => {
        const handleChange = jest.fn();
        const getValueChangeAnalyticsEvent = jest.fn();
        await setupSwitch({ label: 'Test Switch', onValueChange: handleChange, getValueChangeAnalyticsEvent });
        const switchElement = screen.getByLabelText('Test Switch');

        fireEvent.click(switchElement);

        expect(getValueChangeAnalyticsEvent).toHaveBeenCalled();
    });

    it('should handle focus event', async () => {
        const onFocus = jest.fn();
        await setupSwitch({ label: 'Test Switch', onFocus });
        const switchElement = screen.getByLabelText('Test Switch');

        switchElement.focus();

        expect(onFocus).toHaveBeenCalled();
        expect(switchElement).toHaveFocus();
    });

    it('should handle blur event', async () => {
        const onBlur = jest.fn();
        await setupSwitch({ label: 'Test Switch', onBlur });
        const switchElement = screen.getByLabelText('Test Switch');

        switchElement.focus();
        switchElement.blur();

        expect(onBlur).toHaveBeenCalled();
        expect(switchElement).not.toHaveFocus();
    });

    it('should handle label click', async () => {
        const handleChange = jest.fn();
        await setupSwitch({ label: 'Test Switch', onValueChange: handleChange });
        const label = screen.getByText('Test Switch');

        label.click();

        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange).toHaveBeenCalledWith(true);
    });
});
