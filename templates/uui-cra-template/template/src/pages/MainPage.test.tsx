import React from 'react';
import { renderWithContextAsync, screen } from '@epam/uui-test-utils';
import { MainPage } from './MainPage';

it('renders uui docs link', async () => {
    await renderWithContextAsync(<MainPage />);
    const linkElement = screen.getByText(/uui.epam.com/i);
    expect(linkElement).toBeInTheDocument();
});
