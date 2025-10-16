import * as React from 'react';
import { fireEvent, screen, setupComponentForTest, userEvent } from '@epam/uui-test-utils';
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
        const wrapper = screen.queryByTestId('uui-text-input-wrapper') as HTMLDivElement;

        await userEvent.click(wrapper);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('prevents default click behavior when target has uuiMarkers.clickable class', async () => {
        const handleClick = jest.fn();
        const handleChange = jest.fn();
        await setupTextInput({
            value: '',
            onValueChange: handleChange,
            onClick: handleClick,
            rawProps: {
                'data-testid': 'uui-text-input-wrapper',
            },
        });
        const wrapper = screen.queryByTestId('uui-text-input-wrapper') as HTMLDivElement;

        await userEvent.click(wrapper);

        expect(handleClick).not.toHaveBeenCalled();
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
});
