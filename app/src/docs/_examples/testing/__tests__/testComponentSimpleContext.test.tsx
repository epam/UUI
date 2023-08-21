import React from 'react';
import { renderWithContextAsync, screen, fireEvent } from '@epam/uui-test-utils';
import { TextInput } from '@epam/uui';

/** Start: This is some component which we are going to test. It's just an example. */
export interface SomeComponentProps {
    value?: string;
    onValueChange?: (value: string) => void;
}
export function SomeComponent(props: SomeComponentProps) {
    return (
        <TextInput value={ props.value } onValueChange={ props.onValueChange } />
    );
}
/** End */

describe('TestComponent', () => {
    it('should invoke onValuesChange when user types new value', async () => {
        const onValueChangeMock = jest.fn();
        await renderWithContextAsync(<SomeComponent value="monday" onValueChange={ onValueChangeMock } />);
        const input = screen.queryByRole('textbox') as HTMLInputElement;
        expect(input.value).toEqual('monday');
        fireEvent.change(input, { target: { value: 'friday' } });
        expect(onValueChangeMock).toHaveBeenLastCalledWith('friday');
    });

    it('should display new value when value property changes', async () => {
        const onValueChangeMock = jest.fn();
        const { rerender } = await renderWithContextAsync(<SomeComponent value="monday" onValueChange={ onValueChangeMock } />);
        rerender(<SomeComponent value="tuesday" onValueChange={ onValueChangeMock } />);
        const input = screen.queryByRole('textbox') as HTMLInputElement;
        expect(input.value).toEqual('tuesday');
        expect(onValueChangeMock).not.toHaveBeenCalled();
    });
});
