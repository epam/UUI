import React from 'react';
import { render, screen } from '@epam/uui-test-utils';
import { InputAddon } from '../InputAddon';

describe('InputAddon', () => {
    it('should render the content', () => {
        const content = 'Test Content';
        render(<InputAddon content={ content } />);
        const addon = screen.getByText(content);

        expect(addon).toBeInTheDocument();
    });

    it('should apply custom class name', () => {
        const content = 'Test Content';
        const className = 'custom-class';
        render(<InputAddon content={ content } cx={ className } />);
        const addon = screen.getByText(content);

        expect(addon).toHaveClass(className);
    });
});
