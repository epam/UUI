import React from 'react';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { MainMenuIcon } from '../MainMenuIcon';
import { ReactComponent as CalendarIcon } from '@epam/assets/icons/action-calendar-fill.svg';

describe('MainMenuIcon', () => {
    it('should be rendered correctly with minimum props', async () => {
        const tree = await renderSnapshotWithContextAsync(<MainMenuIcon icon={ CalendarIcon } />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <MainMenuIcon
                icon={ CalendarIcon }
                target="_blank"
                link={ { pathname: '/' } }
                collapseToMore
                estimatedWidth={ 120 }
                priority={ 6 }
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});
