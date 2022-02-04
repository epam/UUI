import React from "react";
import { renderWithContextAsync } from '@epam/test-utils';
import {DataTableHeaderCell} from "../DataTableHeaderCell";

jest.mock('react-dom', () => ({
    findDOMNode: jest.fn(),
}));

describe("DataTableHeaderCell", () => {
    it("should be rendered correctly", async () => {
        const tree = await renderWithContextAsync(
            <DataTableHeaderCell
                column={ {
                    key: "test",
                    caption: "Test",
                    render: () => <div>test</div>,
                    width: 200,
                    fix: "left",
                } }
                onSort={ jest.fn() }
                isFirstColumn
                isLastColumn={ false }
                value={ {  } }
                onValueChange={ jest.fn }
            />
        );

        expect(tree).toMatchSnapshot();
    });
});