
import { screen } from '@epam/uui-test-utils';
import { render} from '../test-utils';
import UuiAppPage from '../../pages/arrayTable';

describe("Page with table with demo data from uuiApp is rendered", () => {
    it("should render", () => {
        render(<UuiAppPage />);
        const main = screen.getByText("Demo example with appData");
        expect(main).toBeInTheDocument();
    });
});
