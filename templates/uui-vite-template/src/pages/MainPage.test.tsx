import { MainPage } from './MainPage';
import { renderWithContextAsync, screen } from '@epam/uui-test-utils';

describe('MainPage', () => {
    it('should render link to UUI site', async () => {
        await renderWithContextAsync(<MainPage />);
        const linkElement = screen.getByRole('link', { name: 'uui.epam.com' });
        expect(linkElement).toHaveAttribute('href', 'https://uui.epam.com');
    });
});
