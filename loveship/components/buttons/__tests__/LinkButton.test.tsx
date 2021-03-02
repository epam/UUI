import React from 'react';
import renderer from "react-test-renderer";
import {LinkButton} from '../LinkButton';
import * as acceptIcon from "../../icons/accept-12.svg";

describe('LinkButton', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<LinkButton />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const tree = renderer
            .create(<LinkButton
                color='sun'
                onClick={ jest.fn() }
                icon={ acceptIcon }
                isDisabled={ false }
                isDropdown
                onClear={ jest.fn() }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});