import React from "react";
import renderer from "react-test-renderer";
import {testData} from "@epam/uui";
import {DataTableHeaderRow} from "../DataTableHeaderRow";

jest.mock("react-dom", () => ({
    findDOMNode: jest.fn(),
}));

describe("DataTableHeaderRow", () => {
    it("should render with default props", () => {
        const tree = renderer
            .create(<DataTableHeaderRow value={ null }
                                        onValueChange={ jest.fn() }
                                        columns={ testData.dataColumns }/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with extra props", () => {
        const tree = renderer
            .create(<DataTableHeaderRow
                value={ {
                    topIndex: 0,
                    visibleCount: 10,
                } }
                onValueChange={ jest.fn() }
                columns={ testData.dataColumns }
                size='24'
                textCase='upper'
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});