import React from "react";
import renderer from "react-test-renderer";
import {DataPickerRow} from "../DataPickerRow";

jest.mock("react-dom", () => ({
    findDOMNode: jest.fn(),
}));

describe("DataPickerRow", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<DataPickerRow
                id='test'
                index={ 1 }
                renderItem={ item => <div>{ item }</div> }
                rowKey='test'
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with extra props", () => {
        const tree = renderer
            .create(<DataPickerRow
                id='test'
                index={ 1 }
                renderItem={ item => <div>{ item }</div> }
                rowKey='test'
                borderBottom='night300'
                padding='24'
                size='48'
                isChecked
                isChildrenChecked
                isFocused
                isFoldable
                isFolded
                isSelectable
                isSelected
                onSelect={ jest.fn() }
                onFold={ jest.fn() }
                onCheck={ jest.fn() }
                onClick={ jest.fn() }
                onFocus={ jest.fn() }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


