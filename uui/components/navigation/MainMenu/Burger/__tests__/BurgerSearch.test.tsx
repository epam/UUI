import React from 'react';
import { BurgerSearch } from '../BurgerSearch';
import { ReactComponent as CalendarIcon } from '../../../../../icons/calendar-24.svg';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';

describe('BurgerSearch', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<BurgerSearch value={ null } onValueChange={ () => {} } />);

        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <BurgerSearch value={ null } onValueChange={ () => {} } onAccept={ () => {} } onCancel={ () => {} } icon={ CalendarIcon } iconPosition="right" isDropdown isOpen />,
        );

        expect(tree).toMatchSnapshot();
    });
});
