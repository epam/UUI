import React from "react";
import renderer from "react-test-renderer";
import { demoColumns, dataSource } from "./dataMocks";
import {DataTable} from "../DataTable";

jest.mock("react-dom", () => ({
    findDOMNode: jest.fn(),
}));

describe("DataTable", () => {
    it("should be rendered correctly", () => {
        const view = dataSource.getView({topIndex: 0, visibleCount: 20}, () => {});

        const tree = renderer
            .create(
                <DataTable
                    { ...view.getListProps() }
                    columns={ demoColumns }
                    getRows={ view.getVisibleRows }
                    value={ {} }
                    onValueChange={ jest.fn() }
                />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});