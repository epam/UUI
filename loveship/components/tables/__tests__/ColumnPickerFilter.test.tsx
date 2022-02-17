import React from "react";
import renderer from "react-test-renderer";
import { windowMock } from "@epam/test-utils";
import { dataSource } from "./dataMocks";
import { ColumnPickerFilter } from "../ColumnPickerFilter";

describe("ColumnPickerFilter", () => {
    beforeEach(() => {
        jest.spyOn(window, "window", "get")
            .mockImplementation(() => windowMock);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<ColumnPickerFilter
                selectionMode="single"
                dataSource={ dataSource }
                value={ null }
                onValueChange={ jest.fn() }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<ColumnPickerFilter
                selectionMode="single"
                dataSource={ dataSource }
                value={ null }
                onValueChange={ jest.fn() }
                valueType="id"
                size="30"
                sorting={ { field: "level", direction: "desc" } }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


