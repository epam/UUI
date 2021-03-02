import React from "react";
import renderer from "react-test-renderer";
import {DataTableRow} from "../DataTableRow";

jest.mock("react-dom", () => ({
    findDOMNode: jest.fn(),
}));

describe("DataTableRow", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<DataTableRow
                id='test_id'
                index={ 1 }
                columns={ [
                    {
                        key: "id",
                        caption: "ID",
                        render: product => <div>{ product }</div>,
                        isSortable: true,
                        isAlwaysVisible: true,
                        grow: 0, shrink: 0, width: 96,
                    },
                ] }
                rowKey='test_key'
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});