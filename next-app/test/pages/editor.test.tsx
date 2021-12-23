import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { render} from '../test-utils';
import EditorPage from '../../pages/editor';

describe("Page with table with demo data from uuiApp is rendered", () => {
    it("should render", () => {
        render(<EditorPage />);
        const main = screen.getByText("Demo example with RichTextEditor(RTE)");
        expect(main).toBeInTheDocument();
    });
});
