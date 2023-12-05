import * as React from 'react';
import { fireEvent, screen, setupComponentForTest } from '@epam/uui-test-utils';
import { TextInput, TextInputProps } from '../TextInput';

async function setupTextInput(params: Partial<TextInputProps>) {
    const { mocks, setProps } = await setupComponentForTest<TextInputProps>(
        (context) => ({
            value: params.value,
            onValueChange: params.onValueChange || jest.fn().mockImplementation((newValue) => {
                context.current.setProperty('value', newValue);
            }),
            ...params,
        }),
        (props) => {
            return <TextInput { ...props } />;
        },
    );
    return {
        setProps,
        mocks,
    };
}

describe('TextInput', () => {
    it('handles input change', async () => {
        const handleChange = jest.fn();
        await setupTextInput({ value: '', onValueChange: handleChange });
        const input = screen.getByRole('textbox');

        fireEvent.change(input, { target: { value: 'Test' } });

        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange).toHaveBeenCalledWith('Test');
    });

    it('handles input focus', async () => {
        const handleFocus = jest.fn();
        const handleChange = jest.fn();

        await setupTextInput({ value: '', onValueChange: handleChange, onFocus: handleFocus });
        const input = screen.getByRole('textbox');

        fireEvent.focus(input);

        expect(handleFocus).toHaveBeenCalledTimes(2);
    });

    it('handles input blur', async () => {
        const handleBlur = jest.fn();
        const handleChange = jest.fn();
        await setupTextInput({ value: '', onValueChange: handleChange, onBlur: handleBlur });
        const input = screen.getByRole('textbox');

        fireEvent.blur(input);

        expect(handleBlur).toHaveBeenCalledTimes(1);
    });
});
