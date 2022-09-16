import React from "react";
import { renderWithContextAsync } from '@epam/test-utils';
import { demoColumns } from "./dataMocks";
import { DataSourceState } from '@epam/uui';
import { DataTableHeaderRow } from "../DataTableHeaderRow";

const dataSourceState: DataSourceState = {
    sorting: [{ field: 'name', direction: "asc" }],
};

describe("DataTableHeaderRow", () => {
    it("should render with default props", async () => {
        const tree = await renderWithContextAsync(
            <DataTableHeaderRow
                value={ dataSourceState }
                onValueChange={ jest.fn() }
                columns={ demoColumns }
            />
        );

        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with extra props", async () => {
        const tree = await renderWithContextAsync(
            <DataTableHeaderRow
                value={ dataSourceState }
                onValueChange={ jest.fn() }
                columns={ demoColumns }
                size='24'
                textCase='upper'
                allowColumnsResizing={ true }
                allowColumnsReordering={ true }
                selectAll={ { value: false, onValueChange: jest.fn() } }
            />
        );

        expect(tree).toMatchSnapshot();
    });
});