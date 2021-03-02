import * as React from "react";
import renderer from "react-test-renderer";
import {FlexCell} from "../FlexCell";

describe("FlexCell", () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<FlexCell />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const tree = renderer
            .create(<FlexCell
                onClick={ jest.fn() }
                width='100%'
                minWidth={ 120 }
                alignSelf='center'
                grow={ 1 }
                shrink={ 1 }
                textAlign='left'
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});