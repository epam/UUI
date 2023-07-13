import { MainPage } from './MainPage';
import { renderWithContextAsync, screen } from '../../test-utils/testUtils';

describe('MainPage', () => {
    it('should render link to UUI site', async () => {
        await renderWithContextAsync(<MainPage />);
        const linkElement = screen.getByText(/uui.epam.com/i);
        expect(linkElement).toBeInTheDocument();
    });
});
