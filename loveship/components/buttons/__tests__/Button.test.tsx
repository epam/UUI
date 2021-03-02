import React from 'react';
import renderer from "react-test-renderer";
import {Button} from '../Button';
import * as acceptIcon from "../../icons/accept-12.svg";

describe('Button', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<Button/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const tree = renderer
            .create(<Button
                color='sun'
                fill='white'
                caption='Click me'
                onClick={ jest.fn() }
                onClear={ jest.fn() }
                icon={ acceptIcon }
                isDisabled={ false }
                isDropdown={ true }
                count={ 10 }
                iconPosition='right'
                isOpen
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});