import React from 'react';
import { LinkButton } from '../LinkButton';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { ReactComponent as CalendarIcon } from '@epam/assets/icons/action-calendar-fill.svg';

describe('LinkButton', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<LinkButton />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <LinkButton
                onClick={ jest.fn }
                icon={ CalendarIcon }
                isDisabled={ false }
                isDropdown
                size="30"
                isActive={ true }
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});
