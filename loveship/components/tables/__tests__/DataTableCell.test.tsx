import * as React from "react";
import renderer from "react-test-renderer";
import {DataTableCell} from "../DataTableCell";

jest.mock("react-dom", () => ({
    findDOMNode: jest.fn(),
}));

describe("DataTableCell", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<DataTableCell
                column={ {
                    key: "test",
                    caption: "Test",
                    render: () => <div>test</div>,
                    width: 200,
                    fix: "left",
                } }
                rowProps={ {
                    id: "1",
                    rowKey: "1",
                    index: 1,
                    dnd: {
                        canAcceptDrop: jest.fn(),
                        onDrop: jest.fn(),
                        srcData: {},
                        dstData: {},
                    },
                } }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with extra props", () => {
        const tree = renderer
            .create(<DataTableCell
                column={ {
                    key: "test",
                    caption: "Test",
                    render: () => <div>test</div>,
                    width: 200,
                    fix: "left",
                    info: "test",
                    isSortable: true,
                } }
                rowProps={ {
                    id: "1",
                    rowKey: "1",
                    index: 1,
                    dnd: {
                        canAcceptDrop: jest.fn(),
                        onDrop: jest.fn(),
                        srcData: {},
                        dstData: {},
                    },
                } }
                isLastColumn
                padding='24'
                size='48'
                reusePadding='auto'
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});