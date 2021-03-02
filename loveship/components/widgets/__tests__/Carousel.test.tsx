import React from "react";
import renderer from "react-test-renderer";
import {Carousel} from "../Carousel";

describe("Carousel", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<Carousel items={ [{"test1": 1}, {"test2": 2}] }
                              divideBy={ 1 }
                              renderItem={ item => <div data-test={ item }/> }/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with extra props", () => {
        const tree = renderer
            .create(<Carousel items={ [{"test1": 1}, {"test2": 2}] }
                              divideBy={ 1 }
                              renderItem={ item => <div data-test={ item }/> }
                              color={ "sun" }/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});