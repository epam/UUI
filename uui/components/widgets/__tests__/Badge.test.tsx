import React from 'react';
import { Badge } from '../Badge';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { ReactComponent as CalendarIcon } from '@epam/assets/icons/action-calendar-fill.svg';

describe('Badge', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<Badge />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <Badge
                caption="Test badge"
                fill="solid"
                color="success"
                icon={ CalendarIcon }
                count={ 12 }
                onIconClick={ () => {} }
                onClick={ () => {} }
                isDropdown={ true }
                size="36"
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});
