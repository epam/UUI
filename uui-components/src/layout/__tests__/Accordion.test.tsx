import React from 'react';
import { Accordion, AccordionProps } from '../Accordion';
import { screen, fireEvent, setupComponentForTest } from '@epam/uui-test-utils';

async function setupTestComponent(params: Partial<AccordionProps>) {
    const { mocks, setProps } = await setupComponentForTest<AccordionProps>(
        () => ({
            title: 'Test accordion',
            value: false,
            ...params,
        }),
        (props) => {
            return <Accordion { ...props } />;
        },
    );
    return {
        setProps,
        mocks,
    };
}

describe('Accordion', () => {
    it('should handle change event to true value', async () => {
        const onValueChange = jest.fn();
        await setupTestComponent({
            value: false,
            onValueChange: onValueChange,
        });
        const accordion = screen.getByText('Test accordion');
        fireEvent.click(accordion);
        expect(onValueChange).toHaveBeenCalledWith(true);
    });
    
    it('should handle change event to false value', async () => {
        const onValueChange = jest.fn();
        await setupTestComponent({
            value: true,
            onValueChange: onValueChange,
        });
        const accordion = screen.getByText('Test accordion');
        fireEvent.click(accordion);
        expect(onValueChange).toHaveBeenCalledWith(false);
    });

    it('using isDisabled', async () => {
        const onValueChange = jest.fn();
        await setupTestComponent({
            value: false,
            onValueChange: onValueChange,
            isDisabled: true,

        });
        const accordion = screen.getByText('Test accordion');
        fireEvent.click(accordion);
        expect(onValueChange).not.toHaveBeenCalledWith(true);
    });

    it('should change value when Enter is pressed', async () => {
        const onValueChange = jest.fn();
        await setupTestComponent({
            value: false,
            onValueChange: onValueChange,
        });
        const accordion = screen.getByText('Test accordion');
        accordion.focus();
        fireEvent.keyDown(accordion, { key: 'Enter', code: 'Enter' });

        expect(onValueChange).toHaveBeenCalledWith(true);
    });

    it('should change value when Space is pressed', async () => {
        const onValueChange = jest.fn();
        await setupTestComponent({
            value: false,
            onValueChange: onValueChange,
        });
        const accordion = screen.getByText('Test accordion');
        accordion.focus();
        fireEvent.keyDown(accordion, { key: ' ', code: 'Space' });
        expect(onValueChange).toHaveBeenCalledWith(true);
    });

    it('using children', async () => {
        const onValueChange = jest.fn();
        const { setProps } = await setupTestComponent({
            value: false,
            onValueChange: (value) => {
                setProps({
                    value: value,
                    onValueChange,
                    children: <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit</div>,
                });
                onValueChange(value);
            },
            children: <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit</div>,
        });

        const accordion = screen.getByText('Test accordion');
        accordion.focus();

        fireEvent.click(accordion);

        const children = await screen.findByText('Lorem ipsum dolor sit amet, consectetur adipiscing elit');
        expect(children).toBeInTheDocument();
    });
});
