import * as React from 'react';
import { fireEvent, renderWithContextAsync, screen, setupComponentForTest, userEvent } from '@epam/uui-test-utils';
import { TextInput, TextInputProps } from '../TextInput';

jest.mock('@epam/uui-core', () => {
    return {
        ...jest.requireActual('@epam/uui-core'),
        uuiMarkers: {
            clickable: 'mock-class',
        },
    };
});

async function setupTextInput(params: Partial<TextInputProps>) {
    const { mocks, setProps } = await setupComponentForTest<TextInputProps>(
        (context) => ({
            value: params.value,
            onValueChange: params.onValueChange || jest.fn().mockImplementation((newValue) => {
                context.current?.setProperty('value', newValue);
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

        await userEvent.click(input);

        expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('handles input blur', async () => {
        const handleBlur = jest.fn();
        const handleChange = jest.fn();
        await setupTextInput({ value: '', onValueChange: handleChange, onBlur: handleBlur });
        const input = screen.getByRole('textbox');

        fireEvent.blur(input);

        expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('handles click event', async () => {
        const handleClick = jest.fn();
        const handleChange = jest.fn();
        await setupTextInput({
            value: '',
            onValueChange: handleChange,
            onClick: handleClick,
            rawProps: {
                className: 'uuiMarkers.clickable',
                'data-testid': 'uui-text-input-wrapper',
            },
        });
        const input = screen.getByRole('textbox');

        await userEvent.click(input);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles key down event', async () => {
        const handleKeyDown = jest.fn();
        const handleAccept = jest.fn();
        const handleCancel = jest.fn();

        await setupTextInput({
            onKeyDown: handleKeyDown,
            onAccept: handleAccept,
            onCancel: handleCancel,
        });

        const input = screen.getByRole('textbox');

        fireEvent.keyDown(input, { key: 'Enter' });
        expect(handleKeyDown).toHaveBeenCalledTimes(1);
        expect(handleAccept).toHaveBeenCalledTimes(1);

        fireEvent.keyDown(input, { key: 'Escape' });
        expect(handleKeyDown).toHaveBeenCalledTimes(2);
        expect(handleCancel).toHaveBeenCalledTimes(1);
    });

    it('calls getValueChangeAnalyticsEvent', async () => {
        const handleChange = jest.fn();
        const getValueChangeAnalyticsEvent = jest.fn();
        await setupTextInput({ value: '', onValueChange: handleChange, getValueChangeAnalyticsEvent });
        const input = screen.getByRole('textbox');

        fireEvent.change(input, { target: { value: 'Test' } });

        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(getValueChangeAnalyticsEvent).toHaveBeenCalled();
    });

    it('clears input via keyboard using clear button', async () => {
        function TestComponent(): React.ReactNode {
            const valueInitial = undefined;
            const [
                value,
                setValue,
            ] = React.useState<string | undefined>(valueInitial);

            return (
                <TextInput
                    value={ value }
                    onValueChange={ setValue }
                    onCancel={ () => {
                        setValue(valueInitial);
                    } }
                />
            );
        }

        await renderWithContextAsync(
            <TestComponent />,
        );

        // Initial state check (empty and unfocused input).
        const input = await screen.findByRole('textbox');
        expect(input).toHaveValue('');
        expect(input).not.toHaveFocus();

        // User clicks on the input to start typing.
        await userEvent.click(input);
        expect(input).toHaveFocus();

        /*
            User starts typing some text in the input,
            which makes the clear button to appear.
        */
        await userEvent.type(
            input,
            'Test',
        );
        expect(input).toHaveValue('Test');
        expect(input).toHaveFocus();
        const clearButton = await screen.findByRole(
            'button',
            {
                name: /clear input/i,
            },
        );
        expect(clearButton).toBeInTheDocument();

        // User changes focus to the clear button.
        await userEvent.tab();
        expect(input).not.toHaveFocus();
        expect(clearButton).toHaveFocus();

        // User presses "Enter" key to clear the input's value.
        await userEvent.keyboard('{Enter}');
        expect(input).toHaveValue('');
        expect(input).toHaveFocus();
        expect(clearButton).not.toBeInTheDocument();
    });

    it('calls onIconClick', async () => {
        const handleChange = jest.fn();
        const onIconClick = jest.fn();
        await setupTextInput({
            value: '',
            onValueChange: handleChange,
            icon: () => {
                return null;
            },
            onIconClick,
        });
        const clickableIcon = screen.getByRole(
            'button',
            {
                name: /icon in input/i,
            },
        );

        await userEvent.click(clickableIcon);

        expect(onIconClick).toBeCalledTimes(1);
    });
});
