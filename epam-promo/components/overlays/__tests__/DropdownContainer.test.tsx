import React from 'react';
import { DropdownContainer } from '../DropdownContainer';
import renderer from 'react-test-renderer';
import { Button } from '../../buttons';

describe('DropdownContainer', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<DropdownContainer>
                <Button />
            </DropdownContainer>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<DropdownContainer
                color='gray70'
                width={ 300 }
                height={ 600 }
            >
                <Button />
            </DropdownContainer>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


