import React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { DropdownProps, Dropdown } from '@epam/uui-components';
import { Button,
    DropdownMenuBody,
    IDropdownMenuItemProps,
    IDropdownMenuItemMods,
    MenuItem,
    MenuItemsGroup, SubMenu, Switch, FlexSpacer } from '@epam/promo';
import { DefaultContext } from '@epam/promo/docs';
import { systemIcons } from '@epam/promo/icons/icons';

const { calendar: btnBefore, info: btnAfter } = systemIcons["36"];

const getCustomItem = (props: IDropdownMenuItemProps) => {
    return (
    <div className={props.cx}  style={{ display: "flex", width: "100%", padding: "0.5em 1em", boxSizing: "border-box"}}>
        <span >{props.caption}</span>
        <FlexSpacer />
        <Switch value={props.isSelected} onValueChange={props.onClick}/>
    </div>
    )
}

const dropdownMenuDoc = new DocBuilder<DropdownProps & IDropdownMenuItemMods>({
    name: 'DropdownMenu',
    component: Dropdown as React.ComponentClass<any> }
    )
    .prop('renderBody', { isRequired: true, examples: [{
        value:
            () => {
                const [selected, setSelected] = React.useState(false);

                const handleCLick = (_event: React.SyntheticEvent<any, any>) => {
                    setSelected(!selected)
                }

                return (
                    <DropdownMenuBody style={{maxWidth: "250px"}} >
                        <MenuItem
                            iconBefore={btnBefore}
                            iconAfter={btnAfter}
                            isSelected={selected}
                            caption="Menu Item1"
                            href="https://www.epam.com/"
                            onClick={handleCLick}
                        />
                        <MenuItem
                            caption="Disabled Menu Item"
                            isDisabled={true}
                            onClick={handleCLick}
                        />
                        <SubMenu
                            caption="Menu Item with SubMenu"
                            >
                            <MenuItem
                                caption="Asd ds sfdf sadf sd"
                                onClick={handleCLick}
                            />
                            <MenuItem
                                caption="Bd sd sd sddddsdsfdsd  sd"
                                onClick={handleCLick}
                            />
                            <MenuItem
                                caption="Cds sd"
                                onClick={handleCLick}
                            />
                            <MenuItemsGroup>
                                <MenuItem
                                    iconAfter={btnAfter}
                                    isSelected={selected}
                                    caption="With checkbox"
                                    onClick={handleCLick}
                                />
                                <SubMenu
                                    caption="One More SubMenu"
                                >
                                    <MenuItem
                                        iconAfter={btnAfter}
                                        caption="Menu Item1"
                                        onClick={handleCLick}
                                    />
                                </SubMenu>
                                <MenuItem
                                    iconBefore={btnBefore}
                                    caption="Menu Item2"
                                    onClick={handleCLick}
                                />
                            </MenuItemsGroup>
                        </SubMenu>
                        <MenuItemsGroup>
                            <MenuItem
                                iconAfter={btnAfter}
                                caption="Menu Item1 selected"
                                isSelected={selected}
                                onClick={handleCLick}
                            />
                            <MenuItem
                                iconBefore={btnBefore}
                                isSelected={selected}
                                caption="Group Menu Item2"
                                onClick={handleCLick}
                            />
                        </MenuItemsGroup>
                        <MenuItem
                                iconAfter={btnAfter}
                                caption="Menu Item1 very long long long long long long long long"
                                onClick={handleCLick}
                            />
                            <MenuItem
                                iconBefore={btnBefore}
                                caption="Menu Item2"
                                onClick={handleCLick}
                            />
                        <MenuItemsGroup direction="horizontal" title="With horizontal direction">
                            <MenuItem
                                caption="A"
                                onClick={handleCLick}
                            />
                            <MenuItem
                                caption="B"
                                onClick={handleCLick}
                            />
                            <MenuItem
                                caption="C"
                                onClick={handleCLick}
                            />
                        </MenuItemsGroup>
                        <MenuItemsGroup title="Group title">
                            <MenuItem
                                cx="customItem"
                                onClick={handleCLick}
                                caption="Custom Item"
                                isSelected={selected}
                                renderItem={getCustomItem}
                            />
                        </MenuItemsGroup>
                    </DropdownMenuBody>
                );
            }
        ,
        isDefault: true,
    }] })
    .prop('renderTarget', { isRequired: true, examples: [{
        value: (props: any) => (<Button { ...props } caption="Toggler"/>),
        isDefault: true,
    }] })
    .withContexts(DefaultContext);

export = dropdownMenuDoc;
