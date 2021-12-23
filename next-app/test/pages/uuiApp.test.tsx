import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { render} from '../test-utils';
import UuiAppPage from '../../pages/uuiApp';

describe("Page with table with demo data from uuiApp is rendered", () => {
    it("should render", () => {
        render(<UuiAppPage />);
        const main = screen.getByText("Demo example with appData");
        expect(main).toBeInTheDocument();
    });
});
