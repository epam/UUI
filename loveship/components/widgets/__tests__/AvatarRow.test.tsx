import React from "react";
import renderer from "react-test-renderer";
import {AvatarRow} from "../AvatarRow";

describe("AvatarRow", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<AvatarRow
                img="https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50"
                size="42"
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});