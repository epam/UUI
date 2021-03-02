import React from "react";
import renderer from "react-test-renderer";
import {testData} from "@epam/uui";
import {DataTableScrollRow} from "../DataTableScrollRow";

describe("DataTableScrollRow", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<DataTableScrollRow columns={ testData.dataColumns }/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});