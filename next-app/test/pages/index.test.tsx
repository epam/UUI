import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import IndexPage from '../../pages/index';

describe("Index page is rendered", () => {
    it("should render", () => {
        render(<IndexPage />);
        const main = screen.getByRole("main");
        expect(main).toBeInTheDocument();
    });
});
