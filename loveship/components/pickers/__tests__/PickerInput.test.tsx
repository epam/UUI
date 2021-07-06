import React from "react";
import { renderWithContextAsync } from "@epam/test-utils";
import { dataSource } from "./dataMocks";
import { PickerInput } from "../PickerInput";

jest.mock("react-dom", () => ({
    findDOMNode: jest.fn(),
}));

describe("PickerInput", () => {
    it("should be rendered correctly", async () => {
        const tree = await renderWithContextAsync(
            <PickerInput
                value={ null }
                onValueChange={ jest.fn() }
                selectionMode="single"
                dataSource={ dataSource }
                disableClear
                searchPosition="input"
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with extra props", async () => {
        const tree = await renderWithContextAsync(
            <PickerInput
                value={ [1, 2] }
                onValueChange={ jest.fn() }
                selectionMode="multi"
                dataSource={ dataSource }
                size="24"
                maxItems={ 20 }
                editMode="modal"
                valueType="id"
                getName={ item => item.name }
                autoFocus
                placeholder="Test placeholder"
                filter={ (item: any) => item.level === "A1" }
                sorting={ { direction: "desc", field: "level" } }
                searchPosition="body"
                minBodyWidth={ 900 }
                renderNotFound={ ({ search, onClose = jest.fn() }) => <div
                    onClick={ onClose }>{ `No found ${ search }` }</div> }
                renderFooter={ props => <div>{ props }</div> }
                cascadeSelection
                minCharsToSearch={ 4 }
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});