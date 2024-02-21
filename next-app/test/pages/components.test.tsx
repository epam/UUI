
import { screen } from '@epam/uui-test-utils';
import { render} from '../test-utils';
import ComponentsPage from '../../pages/components';

describe("Demo page with list of components is rendered", () => {
    it("should render", () => {
        render(<ComponentsPage />);
        const main = screen.getByText("Demo example with list of components");
        expect(main).toBeInTheDocument();
    });
});
