
import { screen } from '@epam/uui-test-utils';
import { render} from '../test-utils';
import FormPage from '../../pages/demoForm';

describe("Page with demo form is rendered", () => {
    it("should render", () => {
        render(<FormPage />);
        const main = screen.getByText("Personal Info");
        expect(main).toBeInTheDocument();
    });
});
