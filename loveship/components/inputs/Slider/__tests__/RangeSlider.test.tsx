import React from "react";
import renderer from "react-test-renderer";
import {RangeSlider} from "../RangeSlider";

describe('RangeSlider', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<RangeSlider min={ 1 }
                            max={ 100 }
                            step={ 5 }
                            value={ 50 }
                            onValueChange={ jest.fn() }/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with extra props', () => {
        const tree = renderer
            .create(<RangeSlider min={ 1 }
                            max={ 100 }
                            step={ 5 }
                            value={ 50 }
                            onValueChange={ jest.fn() }
                            color="sun"/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});