import React from "react";
import renderer from "react-test-renderer";
import {Alert} from "../Alert";
import * as acceptIcon from "../../icons/accept-12.svg";

describe("Alert", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<Alert/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with props", () => {
        const tree = renderer
            .create(<Alert
                color="sun"
                actions={ [{action: jest.fn(), name: "test"}] }
                onClose={ jest.fn() }
                cx={ ["root"] }
                icon={ acceptIcon }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});