import React from "react";
import renderer from "react-test-renderer";
import {ConfirmationModal} from "../ConfirmationModal";

describe("ConfirmationModal", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<ConfirmationModal
                abort={ jest.fn() }
                caption='Title'
                success={ jest.fn() }
                zIndex={ 15 }
                key="1"
                isActive
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with extra props", () => {
        const tree = renderer
            .create(<ConfirmationModal
                abort={ jest.fn() }
                caption='Title'
                success={ jest.fn() }
                zIndex={ 15 }
                key="1"
                bodyContent={ <div>content</div> }
                hideCancelButton
                width="900"
                isActive
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});