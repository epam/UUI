import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { render} from '../test-utils';
import ComponentsPage from '../../pages/components';

describe("Demo page with list of components is rendered", () => {
    it("should render", () => {
        render(<ComponentsPage />);
        const main = screen.getByText("Demo example with list of components");
        expect(main).toBeInTheDocument();
    });
});
