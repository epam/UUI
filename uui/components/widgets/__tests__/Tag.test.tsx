import React from 'react';
import { Tag } from '../Tag';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { ReactComponent as CalendarIcon } from '@epam/assets/icons/action-calendar-fill.svg';

describe('Tag', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<Tag />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <Tag
                caption="Test badge"
                icon={ CalendarIcon }
                count={ 12 }
                onIconClick={ () => {} }
                onClick={ () => {} }
                onClear={ () => {} }
                size="36"
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});
