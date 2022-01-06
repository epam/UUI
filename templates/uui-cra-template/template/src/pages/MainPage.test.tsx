import React from 'react';
import { render, screen } from '@testing-library/react';
import { MainPage } from './MainPage';

it('renders uui docs link', () => {
    render(<MainPage />);
    const linkElement = screen.getByText(/uui.epam.com/i);
    expect(linkElement).toBeInTheDocument();
});
