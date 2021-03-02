import * as React from "react";
import renderer from "react-test-renderer";
import {MainMenuSearch} from "../MainMenuSearch";

describe("MainMenuSearch", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<MainMenuSearch value="test" onValueChange={ jest.fn() }/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with props", () => {
        const tree = renderer
            .create(<MainMenuSearch
                value='test'
                onValueChange={ jest.fn() }
                caption='Test button'
                type='primary'
                collapseToMore
                estimatedWidth={ 120 }
                showInBurgerMenu
                priority={ 6 }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});