/**
 *  Note: This example uses  "@epam/uui-test-utils" package to simplify testing.
 */
import React, { useCallback, useState } from 'react';
import {
    setupComponentForTest,
    screen,
    fireEvent,
    renderSnapshotWithContextAsync,
    renderHookWithContextAsync,
    waitFor, renderWithContextAsync,
    act,
} from '@epam/uui-test-utils';
import { TextInput } from '@epam/uui';

/** ****************** */
/** * TestComponent ** */
/** ****************** */

/** Start: This is some component which we are going to test. It's just an example. */
interface TestComponentProps {
    value?: string;
    onValueChange?: (value: string) => void;
}
function TestComponent(props: TestComponentProps) {
    return (
        <TextInput value={ props.value } onValueChange={ props.onValueChange } />
    );
}
/** End */

/**
 *  In this specific case, the "setupComponentForTest" method simplifies testing of next use cases:
 *  - It wraps the component in UUI context;
 *  - It makes it possible to change component's props from the outside without unmounting the component;
 *  - It supports testing of "on-change" workflow, when a callback prop (e.g. onValueChange) updates some other props (e.g. value).
 */
async function setupTestComponent(params: Partial<TestComponentProps>) {
    const { mocks, setProps } = await setupComponentForTest<TestComponentProps>(
        (context) => ({
            value: params.value,
            onValueChange: jest.fn().mockImplementation((newValue) => {
                context.current.setProperty('value', newValue);
            }),
        }),
        (props) => <TestComponent { ...props } />,
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
    it('should render with minimum props', async () => {
        const tree = await renderSnapshotWithContextAsync(<TestComponent />);
        expect(tree).toMatchSnapshot();
    });

    it('should render with maximum props', async () => {
        const tree = await renderSnapshotWithContextAsync(<TestComponent value="monday" onValueChange={ jest.fn() } />);
        expect(tree).toMatchSnapshot();
    });

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

describe('TestComponent (without setupComponentForTest)', () => {
    it('should invoke onValuesChange when user types new value', async () => {
        const onValueChangeMock = jest.fn();
        await renderWithContextAsync(<TestComponent value="monday" onValueChange={ onValueChangeMock } />);
        const input = screen.queryByRole('textbox') as HTMLInputElement;
        expect(input.value).toEqual('monday');
        fireEvent.change(input, { target: { value: 'friday' } });
        expect(onValueChangeMock).toHaveBeenLastCalledWith('friday');
    });
});

/** ****************** */
/** * useTestHook ** */
/** ****************** */

/** Start: This is some hook which we are going to test. It's just an example. */
function useTestHook() {
    const [result, setResult] = useState<number>(0);
    const increment = useCallback(() => {
        setResult((prev) => prev + 1);
    }, []);

    return {
        increment,
        result,
    };
}
/** End */

describe('useTestHook', () => {
    it('should increment', async () => {
        const { result } = await renderHookWithContextAsync(useTestHook);
        expect(result.current.result).toBe(0);
        act(() => {
            result.current.increment();
        });
        await waitFor(() => {
            expect(result.current.result).toBe(1);
        });
    });
});
