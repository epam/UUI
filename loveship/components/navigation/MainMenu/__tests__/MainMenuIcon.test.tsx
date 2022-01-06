import * as React from "react";
import renderer from "react-test-renderer";
import {MainMenuIcon} from "../MainMenuIcon";
import { ReactComponent as AcceptIcon } from "../../../icons/accept-12.svg";

describe("MainMenuIcon", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<MainMenuIcon icon={ AcceptIcon }/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const tree = renderer
            .create(<MainMenuIcon
                icon={ AcceptIcon }
                target='_blank'
                link={ { pathname: '/' } }
                collapseToMore
                estimatedWidth={ 120 }
                priority={ 6 }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});