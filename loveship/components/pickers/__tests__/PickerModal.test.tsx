import React from "react";
import renderer from "react-test-renderer";
import {testData} from "@epam/uui";
import {PickerModal} from "../PickerModal";

jest.mock("react-dom", () => ({
    findDOMNode: jest.fn(),
}));

describe("PickerModal", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<PickerModal
                key='test'
                valueType='id'
                dataSource={ testData.dataSource }
                success={ jest.fn() }
                abort={ jest.fn() }
                zIndex={ 1 }
                selectionMode='single'
                initialValue={ null }
                isActive
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


