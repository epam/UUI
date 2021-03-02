import React from "react";
import renderer from "react-test-renderer";
import {DataTableHeaderCell} from "../DataTableHeaderCell";

jest.mock("react-dom", () => ({
    findDOMNode: jest.fn(),
}));

describe("DataTableHeaderCell", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<DataTableHeaderCell
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
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});