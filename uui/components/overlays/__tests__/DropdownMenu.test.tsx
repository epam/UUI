import React from 'react';
import {
    DropdownMenuBody,
    DropdownMenuButton,
    DropdownSubMenu,
    DropdownMenuSplitter,
    DropdownMenuHeader,
    DropdownMenuSwitchButton,
} from '../';
import {
    fireEvent,
    renderSnapshotWithContextAsync,
    renderWithContextAsync,
    screen,
} from '@epam/uui-test-utils';
import { settings } from '../../../settings';

const icon = settings.dropdownMenu.icons.dropdownIcon;

describe('DropdownMenu', () => {
    it('should be rendered DropdownMenuBody correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <DropdownMenuBody onClose={ () => {} } style={ { maxWidth: '250px' } }>
                <DropdownMenuButton caption="Menu Item in Submenu" />
                <DropdownMenuSplitter />
                <DropdownMenuHeader caption="An example of DropdownMenuHeader" />
                <DropdownSubMenu caption="One More SubMenu">
                    <DropdownMenuButton icon={ icon } iconPosition="right" caption="Menu Item with icon in right" />
                </DropdownSubMenu>
            </DropdownMenuBody>,
        );
        expect(tree).toMatchSnapshot();
    });

    describe('DropdownMenuSwitchButton', () => {
        it('should call onValueChange once when Switch is clicked (no double fire from row click)', async () => {
            const onValueChange = jest.fn();
            await renderWithContextAsync(
                <DropdownMenuBody onClose={ () => {} }>
                    <DropdownMenuSwitchButton
                        caption="Notifications"
                        isSelected={ false }
                        onValueChange={ onValueChange }
                    />
                </DropdownMenuBody>,
            );

            // click on the real switch element, not the row
            fireEvent.click(screen.getByRole('switch'));

            expect(onValueChange).toHaveBeenCalledTimes(1);
            expect(onValueChange).toHaveBeenCalledWith(true);
        });
    });
});
