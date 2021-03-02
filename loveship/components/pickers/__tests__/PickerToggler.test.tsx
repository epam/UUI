import React from "react";
import renderer from "react-test-renderer";
import {PickerToggler} from "../PickerToggler";

describe("PickerToggler", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<PickerToggler pickerMode='single'/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with extra props", () => {
        const tree = renderer
            .create(<PickerToggler
                onClick={ jest.fn() }
                onKeyDown={ jest.fn() }
                value={ null }
                onValueChange={ jest.fn() }
                maxItems={ 6 }
                getName={ item => item.value }
                selection={ [
                    {
                        id: "test",
                        index: 1,
                        rowKey: "test",
                        value: "test",
                    },
                ] }
                onBlur={ jest.fn() }
                onClear={ jest.fn() }
                pickerMode='multi'
                mode='cell'
                size='24'
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});