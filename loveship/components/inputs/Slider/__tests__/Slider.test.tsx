import React from "react";
import renderer from "react-test-renderer";
import {Slider} from "../Slider";

describe('Slider', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<Slider min={ 1 }
                            max={ 100 }
                            step={ 5 }
                            value={ 50 }
                            onValueChange={ jest.fn() }/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with extra props', () => {
        const tree = renderer
            .create(<Slider min={ 1 }
                            max={ 100 }
                            step={ 5 }
                            value={ 50 }
                            onValueChange={ jest.fn() }
                            color="sun"/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});