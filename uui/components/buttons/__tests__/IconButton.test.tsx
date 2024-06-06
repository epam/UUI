import React from 'react';
import { IconButton } from '../IconButton';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { ReactComponent as CalendarIcon } from '@epam/assets/icons/action-calendar-fill.svg';

describe('IconButton', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<IconButton />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <IconButton
                color="primary"
                onClick={ jest.fn }
                icon={ CalendarIcon }
                isDisabled={ true }
                isOpen={ true }
                showDropdownIcon={ true }
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});
