import React from 'react';
import {
    DropdownMenuBody, DropdownMenuButton, DropdownSubMenu, DropdownMenuSplitter, DropdownMenuHeader,
} from '../';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { systemIcons } from '../../../icons/icons';

const { accept: icon } = systemIcons['30'];

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
});
