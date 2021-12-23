import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { render} from '../test-utils';
import TablePage from '../../pages/table';

describe("Page with demo table is rendered", () => {
    it("should render", () => {
        render(<TablePage />);
        const main = screen.getByText("Demo example with table");
        expect(main).toBeInTheDocument();
    });
});
