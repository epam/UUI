/* eslint no-restricted-imports : 0 */
import React from 'react';
import { render, act, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { useUuiServices, StubAdaptedRouter, UuiContext, UuiContexts } from '@epam/uui-core';
import { TextInput } from '@epam/uui';

/** Reusable utils - START */
function UuiContextDefaultWrapper({ children }) {
    const testUuiCtx = {} as UuiContexts;
    const router = new StubAdaptedRouter();
    const { services } = useUuiServices({ router });
    Object.assign(testUuiCtx, services);
    return (
        (
            <UuiContext value={ services }>
                { children }
            </UuiContext>
        )
    );
}
async function renderSnapshot(reactElement: any) {
    const result = renderer.create(React.createElement(UuiContextDefaultWrapper, { children: reactElement }));
    await act(() => new Promise((resolve) => {
        setTimeout(resolve, 1);
    }));
    return result.toJSON();
}
async function renderToJsDom(reactElement: any) {
    const result = render(reactElement, { wrapper: UuiContextDefaultWrapper });
    await act(() => new Promise((resolve) => {
        setTimeout(resolve, 1);
    }));
    return result;
}
/** Reusable utils - END */

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

describe('SomeComponent', () => {
    it('should render with minimum props', async () => {
        const tree = await renderSnapshot(<SomeComponent />);
        expect(tree).toMatchSnapshot();
    });
    it('should render textbox to jsdom', async () => {
        await renderToJsDom(<SomeComponent />);
        expect(screen.getAllByRole('textbox')).toBeDefined();
    });
});
