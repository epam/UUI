import React from "react";
import renderer from "react-test-renderer";
import {testData} from "@epam/uui";
import {DataTable} from "../DataTable";

jest.mock("react-dom", () => ({
    findDOMNode: jest.fn(),
}));

describe("DataTable", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(
                <DataTable
                    { ...testData.dataSourceView.getListProps() }
                    columns={ testData.dataColumns }
                    getRows={ testData.dataSourceView.getVisibleRows }
                    value={ {} }
                    onValueChange={ jest.fn() }
                />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    
    it("should be rendered correctly with empty columns and rows", () => {
        const tree = renderer
            .create(
                <DataTable
                    columns={ [] }
                    getRows={ () => [] }
                    value={ {} }
                    onValueChange={ jest.fn() }
                />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});