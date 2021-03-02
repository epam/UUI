import React from 'react';
import renderer from "react-test-renderer";
import {IconButton} from '../IconButton';
import * as acceptIcon from "../../icons/accept-12.svg";

describe('IconButton', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<IconButton />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const tree = renderer
            .create(<IconButton
                color='sun'
                onClick={ jest.fn() }
                icon={ acceptIcon }
                isDisabled={ false }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});