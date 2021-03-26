import React from "react";
import renderer from "react-test-renderer";
import {demoColumns} from "./dataMocks";
import {DataTableScrollRow} from "../DataTableScrollRow";

class ResizeObserverMock {
    observe = () => jest.fn();
    unobserve = () => jest.fn();
    disconnect = () => jest.fn();
}

global.ResizeObserver = ResizeObserverMock;

describe("DataTableScrollRow", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<DataTableScrollRow columns={ demoColumns }/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});