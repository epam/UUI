import React from "react";
import renderer from "react-test-renderer";
import {RadioGroup} from "../RadioGroup";

describe('RadioGroup', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<RadioGroup
                value={ false }
                onValueChange={ jest.fn() }
                items={ [{ id: 1, name: 'Test1' }, { id: 2, name: 'Test2' }] }

            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const tree = renderer
            .create(<RadioGroup
                value={ false }
                onValueChange={ jest.fn() }
                items={ [{ id: 1, name: 'Test1' }, { id: 2, name: 'Test2' }] }
                direction='horizontal'
                isDisabled
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});