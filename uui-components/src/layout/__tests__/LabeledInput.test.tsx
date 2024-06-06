import React from 'react';
import { screen, setupComponentForTest } from '@epam/uui-test-utils';
import { LabeledInput, LabeledInputProps } from '../LabeledInput';

async function setupTestComponent() {
    const { mocks, setProps } = await setupComponentForTest<LabeledInputProps>(
        () => ({
            for: '2233',
            label: 'Test label',
        }),
        (props) => {
            return <LabeledInput { ...props }></LabeledInput>;
        },
    );
    return {
        setProps,
        mocks,
    };
}

describe('LabeledInput', () => {
    it('label has uui-label class', async () => {
        const { setProps } = await setupTestComponent();
        setProps({ label: 'Test label' });
        const labelElement = screen.getByText('Test label');
        expect(labelElement.closest('label')).toHaveClass('uui-label');
    });

    it('uses sidenote prop', async () => {
        const { setProps } = await setupTestComponent();
        setProps({ sidenote: 'This is a sidenote' });
        expect(screen.getByText('This is a sidenote')).toBeInTheDocument();
    });

    it('uses isInvalid prop', async () => {
        const { setProps } = await setupTestComponent();
        setProps({
            validationMessage: 'Test error message',
            isInvalid: true,
        });
        expect(screen.getByText('Test error message')).toBeInTheDocument();
    });

    it('if isInvalid equals false, we don\'t have a validationMessage', async () => {
        const { setProps } = await setupTestComponent();
        setProps({
            validationMessage: 'Test error message',
            isInvalid: false,
        });
        expect(screen.queryByText('Test error message')).not.toBeInTheDocument();
    });

    it('uses footnote prop', async () => {
        const { setProps } = await setupTestComponent();
        setProps({
            footnote: 'Test footnote',
        });
        expect(screen.getByText('Test footnote')).toBeInTheDocument();
    });

    it('uses sidenote as string prop', async () => {
        const { setProps } = await setupTestComponent();
        setProps({
            sidenote: 'Test sidenote',
        });
        expect(screen.getByText('Test sidenote')).toBeInTheDocument();
    });

    it('uses sidenote as Element prop', async () => {
        const { setProps } = await setupTestComponent();
        setProps({
            sidenote: <span>Test sidenote</span>,
        });
        const sidenoteElement = screen.getByText('Test sidenote');
        expect(sidenoteElement).toBeInTheDocument();
    });

    it('uses charCounter prop', async () => {
        const { setProps } = await setupTestComponent();
        setProps({
            charCounter: true,
            maxLength: 5,
        });
        expect(screen.getByText('0/5')).toBeInTheDocument();
    });

    it('uses isOptional prop', async () => {
        const { setProps } = await setupTestComponent();
        setProps({
            isOptional: true,
        });
        expect(screen.getByText('This field is optional')).toBeInTheDocument();
    });
});
