import React from "react";
import renderer from "react-test-renderer";
import {testData} from "@epam/uui";
import {PickerInput} from "../PickerInput";

jest.mock("react-dom", () => ({
    findDOMNode: jest.fn(),
}));

describe("PickerInput", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<PickerInput
                value={ null }
                onValueChange={ jest.fn() }
                selectionMode='single'
                dataSource={ testData.dataSource }
                disableClear
                searchPosition='input'
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with extra props", () => {
        const tree = renderer
            .create(<PickerInput
                value={ [1, 2] }
                onValueChange={ jest.fn() }
                selectionMode='multi'
                dataSource={ testData.dataSource }
                size='48'
                maxItems={ 20 }
                editMode='modal'
                valueType='id'
                getName={ item => item.name }
                autoFocus
                placeholder='Test placeholder'
                filter={ (item: any) => item.level === "A1" }
                sorting={ {direction: "desc", field: "level"} }
                searchPosition='body'
                minBodyWidth={ 900 }
                renderNotFound={ ({search, onClose = jest.fn()}) => <div onClick={ onClose }>{ `No found ${search}` }</div> }
                renderFooter={ props => <div>{ props }</div> }
                cascadeSelection
                dropdownHeight={ 48 }
                minCharsToSearch={ 4 }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});