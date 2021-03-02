import React from "react";
import renderer from "react-test-renderer";
import {Avatar} from "../Avatar";

describe("Avatar", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<Avatar
                img="https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50"
                size="42"
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with extra props", () => {

        const tree = renderer
            .create(<Avatar
                img="https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50"
                size="36"
                alt="Avatar"
                isLoading
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});