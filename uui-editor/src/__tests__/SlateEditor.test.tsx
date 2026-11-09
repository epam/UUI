import React from 'react';
import { setupComponentForTest, screen, userEvent } from '@epam/uui-test-utils';
import { SlateEditor, PlateEditorProps } from '../SlateEditor';

async function setupSlateEditor() {
    const {
        result, mocks, setProps,
    } = await setupComponentForTest<PlateEditorProps>(
        () => {
            return {
                value: [{ type: 'paragraph', children: [{ text: 'Hello' }] }],
                onValueChange: jest.fn(),
                isReadonly: false,
                plugins: [],
                mode: 'form',
                placeholder: 'Add description',
                minHeight: 'none',
                fontSize: '14',
            };
        },
        (props) => <SlateEditor { ...props } />,
    );

    const input = screen.getByRole<HTMLInputElement>('textbox');
    const dom = { input };

    return {
        result,
        setProps,
        mocks,
        dom,
    };
}

describe('SlateEditor', () => {
    it('should update editor.childrent on editor value prop change', async () => {
        const { setProps } = await setupSlateEditor();
        expect(screen.getByText('Hello')).toBeInTheDocument();

        setProps({ value: [
            { type: 'paragraph', children: [{ text: 'World' }] },
        ] });

        expect(screen.queryByText('Hello')).not.toBeInTheDocument();
        expect(screen.getByText('World')).toBeInTheDocument();
    });

    it('should keep Slate text points mapped to the DOM while typing', async () => {
        await setupSlateEditor();
        const input = screen.getByRole('textbox');

        await userEvent.click(input);
        await userEvent.type(input, '!');

        expect(input).toHaveTextContent('!');
    });
});
