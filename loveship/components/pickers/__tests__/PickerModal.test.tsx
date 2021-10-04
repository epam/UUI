import React from "react";
import { renderWithContextAsync } from "@epam/test-utils";
import { dataSource } from "./dataMocks";
import { PickerModal } from "../PickerModal";

jest.mock("react-dom", () => ({
    findDOMNode: jest.fn(),
}));

describe("PickerModal", () => {
    it("should be rendered correctly", async () => {
        const tree = await renderWithContextAsync(
            <PickerModal
                key="test"
                valueType="id"
                dataSource={ dataSource }
                success={ jest.fn() }
                abort={ jest.fn() }
                zIndex={ 1 }
                selectionMode="single"
                initialValue={ null }
                isActive
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});


