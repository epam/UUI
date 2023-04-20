import React from 'react';
import {
    DropdownMenuBody, DropdownMenuButton, DropdownSubMenu, DropdownMenuSplitter, DropdownMenuHeader,
} from '../';
import renderer from 'react-test-renderer';
import { systemIcons } from '../../../icons/icons';

const { accept: icon } = systemIcons['30'];

describe('DropdownMenu', () => {
    it('should be rendered DropdownMenuBody correctly', () => {
        const tree = renderer
            .create(
                <DropdownMenuBody onClose={ () => {} } style={ { maxWidth: '250px' } }>
                    <DropdownMenuButton caption="Menu Item in Submenu" />
                    <DropdownMenuSplitter />
                    <DropdownMenuHeader caption="An example of DropdownMenuHeader" />
                    <DropdownSubMenu caption="One More SubMenu">
                        <DropdownMenuButton icon={ icon } iconPosition="right" caption="Menu Item with icon in right" />
                    </DropdownSubMenu>
                </DropdownMenuBody>,
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
