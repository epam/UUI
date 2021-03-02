import React from "react";
import renderer from "react-test-renderer";
import {AvatarStack} from "../AvatarStack";

describe("AvatarStack", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<AvatarStack
                avatarsCount={ 3 }
                avatarSize={ "48" }
                direction={ "right" }
                urlArray={ new Array(5).fill('https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50') }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});