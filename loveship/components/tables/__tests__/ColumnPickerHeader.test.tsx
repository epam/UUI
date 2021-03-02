import React from "react";
import renderer from "react-test-renderer";
import {ColumnPickerHeader} from "../ColumnPickerHeader";

describe('ColumnPickerHeader', () => {
    it('should be rendered correctly with asc direction', () => {
        const tree = renderer
            .create(<ColumnPickerHeader sortDirection={ "asc" } onSort={ jest.fn() }/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with desc direction', () => {
        const tree = renderer
            .create(<ColumnPickerHeader sortDirection={ "desc" } onSort={ jest.fn() }/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});