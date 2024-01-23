import React from 'react';
import { DropdownContainer } from '../DropdownContainer';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { Button } from '../../buttons';

describe('DropdownContainer', () => {
    it('should be rendered correctly with minimum props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <DropdownContainer>
                <Button />
            </DropdownContainer>,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <DropdownContainer width={ 300 } height={ 600 } vPadding="18" padding="24" focusLock={ false }>
                <Button />
            </DropdownContainer>,
        );
        expect(tree).toMatchSnapshot();
    });
});
