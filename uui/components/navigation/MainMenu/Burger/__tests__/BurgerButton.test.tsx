import React from 'react';
import { BurgerButton } from '../BurgerButton';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { ReactComponent as CalendarIcon } from '@epam/assets/icons/action-calendar-fill.svg';

describe('BurgerButton', () => {
    it('should be rendered correctly with minimum props', async () => {
        const tree = await renderSnapshotWithContextAsync(<BurgerButton />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <BurgerButton
                caption="Test button"
                icon={ CalendarIcon }
                href="#"
                target="_blank"
                type="secondary"
                isDropdown
                isOpen={ false }
                isActive={ true }
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});
