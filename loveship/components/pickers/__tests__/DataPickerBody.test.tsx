import React from "react";
import renderer from "react-test-renderer";
import {dataSource} from "./dataMocks";
import {DataPickerBody} from "../DataPickerBody";
import {DataPickerRow} from "../DataPickerRow";

jest.mock("react-dom", () => ({
    findDOMNode: jest.fn(),
}));

describe("DataPickerBody", () => {
    const value = {};
    const onValueChange = jest.fn();
    const search = {
        value: "test",
        onValueChange: jest.fn(),
    };

    it("should be rendered correctly", () => {
        const view = dataSource.getView({topIndex: 0, visibleCount: 10, focusedIndex: 1}, () => {});

        const tree = renderer
            .create(<DataPickerBody
                value={ value }
                onValueChange={ onValueChange }
                rows={ view.getVisibleRows() }
                search={ search }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    const rows = dataSource.props.items.map(props => (
        <DataPickerRow
            key={ props.id }
            renderItem={ item => <div>{ item }</div> }
            id={ props.id }
            rowKey={ props.gender }
            index={ props.id }
        />
    ));

    it("should be rendered correctly with extra props", () => {
        const tree = renderer
            .create(<DataPickerBody
                value={ value }
                onValueChange={ onValueChange }
                rows={ rows }
                search={ search }
                showSearch
                showSelectedRows
                maxHeight={ 200 }
                renderNotFound={ () => <div>Not found</div> }
                editMode='dropdown'
                onKeyDown={ jest.fn() }
                scheduleUpdate={ jest.fn() }
                searchSize='24'
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with empty rows", () => {
        const tree = renderer
            .create(<DataPickerBody
                value={ value }
                onValueChange={ onValueChange }
                rows={ [] }
                search={ search }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});