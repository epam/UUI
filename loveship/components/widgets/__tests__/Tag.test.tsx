import React from "react";
import renderer from "react-test-renderer";
import {Tag} from "../Tag";
import * as acceptIcon from "../../icons/accept-12.svg";

describe('Tag', () => {
    it('should render with default props', () => {
        const tree = renderer
            .create(<Tag/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should render with all new props', () => {
        const tree = renderer
            .create(<Tag 
                fill={ "white" }
                size={ "24" }
                caption='Test tag'
                icon={ acceptIcon }
                count={ 12 }
                onIconClick={ jest.fn() }
                onClick={ jest.fn() }
                onClear={ jest.fn() }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});