import React from 'react';
import { DropdownContainer } from '../DropdownContainer';
import { renderer } from '@epam/uui-test-utils';
import { Button } from '../../buttons';

describe('DropdownContainer', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(
                <DropdownContainer>
                    <Button />
                </DropdownContainer>,
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(
                <DropdownContainer width={ 300 } height={ 600 } vPadding="18" padding="24" focusLock={ false }>
                    <Button />
                </DropdownContainer>,
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
