import React, { useCallback, useState } from 'react';
import {
    Dropdown,
    DropdownMenuBody,
    DropdownMenuButton,
    FlexCell,
    FlexRow,
    FlexSpacer,
    IconButton,
    VerticalTabButton,
} from '@epam/uui';
import { ReactComponent as MoreIcon } from '@epam/assets/icons/navigation-more_vert-outline.svg';
import { ReactComponent as DeleteIcon } from '@epam/assets/icons/action-delete-fill.svg';
import { ReactComponent as ExportIcon } from '@epam/assets/icons/file-export-outline.svg';

export default function BasicTabButtonExample() {
    const [value, onValueChange] = useState('Home');

    const renderDropdownList = useCallback(() => {
        return (
            <>
                <FlexSpacer />
                <Dropdown
                    renderTarget={
                        (props) => (
                            <IconButton
                                { ...props }
                                icon={ MoreIcon }
                                size="24"
                                color="secondary"
                            />
                        )
                    }
                    renderBody={
                        (props) => (
                            <DropdownMenuBody { ...props }>
                                <DropdownMenuButton caption="Export" icon={ ExportIcon } onClick={ () => {} } />
                                <DropdownMenuButton caption="Delete" icon={ DeleteIcon } onClick={ () => {} } />
                            </DropdownMenuBody>
                        )
                    }
                />
            </>
        );
    }, []);

    return (
        <FlexRow>
            <FlexCell grow={ 1 } width={ 250 }>
                <VerticalTabButton size="36" caption="Main" isActive={ value === 'Main' } onClick={ () => onValueChange('Main') } />
                <VerticalTabButton size="36" caption="Home" isActive={ value === 'Home' } onClick={ () => onValueChange('Home') } />
                <VerticalTabButton size="36" caption="Tools" isActive={ value === 'Tools' } onClick={ () => onValueChange('Tools') } count={ 18 } />
                <VerticalTabButton size="36" caption="Options" isActive={ value === 'Options' } onClick={ () => onValueChange('Options') } withNotify={ true } renderAddons={ renderDropdownList } />
            </FlexCell>
        </FlexRow>
    );
}
