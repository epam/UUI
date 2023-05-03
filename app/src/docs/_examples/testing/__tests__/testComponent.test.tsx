import React from 'react';
import { setupComponentForTest, screen, fireEvent } from '@epam/uui-test-utils';
import { TextInput } from '@epam/uui';

/** Start: This is some component which we are going to test. It's just an example. */
export interface SomeComponentProps {
    value: string;
    onValueChange: (value: string) => void;
}
export function SomeComponent(props: SomeComponentProps) {
    return (
        <TextInput value={ props.value } onValueChange={ props.onValueChange } />
    );
}
/** End */

async function setupTestComponent(params: Partial<SomeComponentProps>) {
    const { mocks, setProps } = await setupComponentForTest<SomeComponentProps>(
        (context) => ({
            value: params.value,
            onValueChange: jest.fn().mockImplementation((newValue) => {
                context.current.setProperty('value', newValue);
            }),
        }),
        (props) => <SomeComponent { ...props } />,
    );
    const input = screen.queryByRole('textbox') as HTMLInputElement;
    const dom = { input };
    return {
        setProps,
        mocks,
        dom,
    };
}

describe('TestComponent', () => {
    it('should invoke onValuesChange when user types new value', async () => {
        const { mocks, dom } = await setupTestComponent({ value: 'monday' });
        expect(dom.input.value).toEqual('monday');
        fireEvent.change(dom.input, { target: { value: 'friday' } });
        expect(dom.input.value).toEqual('friday');
        expect(mocks.onValueChange).toHaveBeenLastCalledWith('friday');
    });

    it('should display new value when value property changes', async () => {
        const { setProps, mocks, dom } = await setupTestComponent({ value: 'monday' });
        setProps({ value: 'tuesday' });
        expect(dom.input.value).toEqual('tuesday');
        expect(mocks.onValueChange).not.toHaveBeenCalled();
    });
});
