import React from 'react';
import { Checkbox, CheckboxProps } from '../Checkbox';
import { render, screen, fireEvent, setupComponentForTest } from '@epam/uui-test-utils';

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

    it('should not handle change event when readonly', () => {
        const onValueChange = jest.fn();
        render(<Checkbox value={ false } onValueChange={ onValueChange } isReadonly />);
        const input = screen.getByRole('checkbox');

        fireEvent.click(input);
        expect(onValueChange).not.toHaveBeenCalled();
    });

    it('should handle focus event', () => {
        const onFocus = jest.fn();
        render(<Checkbox value={ false } onValueChange={ jest.fn } onFocus={ onFocus } />);
        const input = screen.getByRole('checkbox');

        input.focus();

        expect(onFocus).toHaveBeenCalled();
    });

    it('should handle blur event', () => {
        const onBlur = jest.fn();
        render(<Checkbox value={ false } onValueChange={ jest.fn } onBlur={ onBlur } />);
        const input = screen.getByRole('checkbox');

        input.focus();
        input.blur();

        expect(onBlur).toHaveBeenCalled();
    });
});
