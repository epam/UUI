import { renderWithContextAsync, screen } from '@epam/uui-test-utils';
import React from 'react';
import IndexPage from '../../pages/index';

describe('Index page is rendered', () => {
    it('should render', async () => {
        await renderWithContextAsync(<IndexPage />);
        const main = screen.getByRole('main');
        expect(main).toBeInTheDocument();
    });
});
