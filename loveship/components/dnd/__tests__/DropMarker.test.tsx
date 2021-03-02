import React from "react";
import renderer from "react-test-renderer";
import {DropMarker, DropMarkerProps} from "../DropMarker";

describe("Drop Marker", () => {
    const eventHandlers: DropMarkerProps["eventHandlers"] = {
        onMouseDown: jest.fn(),
        onMouseUp: jest.fn(),
        onMouseEnter: jest.fn(),
        onMouseLeave: jest.fn(),
    };

    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<DropMarker
                isDndInProgress
                isDraggable
                isDraggedOut
                isDraggedOver
                isDragGhost
                isDropAccepted
                eventHandlers={ eventHandlers }
                classNames={ ["test-class"] }
                position='top'
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});