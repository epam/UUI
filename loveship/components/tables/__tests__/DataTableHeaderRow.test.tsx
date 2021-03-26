import React from "react";
import renderer from "react-test-renderer";
import {demoColumns} from "./dataMocks";
import {DataSourceState} from '@epam/uui';
import {DataTableHeaderRow} from "../DataTableHeaderRow";

jest.mock("react-dom", () => ({
    findDOMNode: jest.fn(),
}));

const dataSourceState: DataSourceState = {
    sorting: [{ field: 'name', direction: "asc" }],
};

describe("DataTableHeaderRow", () => {
    it("should render with default props", () => {
        const tree = renderer
            .create(<DataTableHeaderRow
                value={ dataSourceState }
                onValueChange={ jest.fn() }
                columns={ demoColumns }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with extra props", () => {
        const tree = renderer
            .create(<DataTableHeaderRow
                value={ dataSourceState }
                onValueChange={ jest.fn() }
                columns={ demoColumns }
                size='24'
                textCase='upper'
                allowColumnsResizing={ true }
                allowColumnsReordering={ true }
                selectAll={ { value: false, onValueChange: jest.fn() } }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});