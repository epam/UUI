/* eslint no-restricted-imports : 0 */
import React from 'react';
import { render, screen } from '@testing-library/react';
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

describe('SomeComponent', () => {
    it('should render with minimum props', () => {
        const { asFragment } = render(<SomeComponent />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('should render textbox to jsdom', () => {
        render(<SomeComponent />);
        expect(screen.getByRole('textbox')).toBeDefined();
    });
});
