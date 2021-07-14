import React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { DropdownProps, Dropdown } from '@epam/uui-components';
import { Button,
    DropdownMenuBody,
    IDropdownMenuItemMods,
    MenuItem,
    MenuItemsGroup, SubMenu } from '@epam/promo';
import { DefaultContext } from '@epam/promo/docs';
import { systemIcons } from '@epam/promo/icons/icons';

const { calendar: btnBefore, info: btnAfter } = systemIcons["36"];

const dropdownMenuDoc = new DocBuilder<DropdownProps & IDropdownMenuItemMods>({
    name: 'DropdownMenu',
    component: Dropdown as React.ComponentClass<any> }
    )
    .prop('renderBody', { isRequired: true, examples: [{
        value:
            () => {
                const [selected, setSelected] = React.useState(false);

                return (
                    <DropdownMenuBody style={{maxWidth: "250px"}} >
                        <MenuItem
                            iconBefore={btnBefore}
                            iconAfter={btnAfter}
                            selectableType="switch"
                            isSelected={selected}
                            onSelectChange={setSelected}
                            caption="Menu Item1"
                            onClick={()=> console.log("Item click1")}
                        />
                        <MenuItem
                            caption="Disabled Menu Item"
                            isDisabled={true}
                            onClick={()=> console.log("Item click2")}
                        />
                        <SubMenu
                            caption="Menu Item with SubMenu"
                            selectableType="switch"
                            isSelected={selected}
                            onSelectChange={setSelected}
                            >
                            <MenuItem
                                caption="Asd ds sfdf sadf sd"
                                onClick={()=> console.log("Item click1")}
                            />
                            <MenuItem
                                caption="Bd sd sd sddddsdsfdsd  sd"
                                onClick={()=> console.log("Item click2")}
                            />
                            <MenuItem
                                caption="Cds sd"
                                onClick={()=> console.log("Item click2")}
                            />
                            <MenuItemsGroup>
                                <MenuItem
                                    iconAfter={btnAfter}
                                    selectableType="check"
                                    isSelected={selected}
                                    onSelectChange={setSelected}
                                    caption="With checkbox"
                                    onClick={()=> console.log("Item click1")}
                                />
                                <SubMenu
                                    caption="One More SubMenu"
                                >
                                    <MenuItem
                                        iconAfter={btnAfter}
                                        caption="Menu Item1"
                                        onClick={()=> console.log("Item click1")}
                                    />
                                </SubMenu>
                                <MenuItem
                                    iconBefore={btnBefore}
                                    caption="Menu Item2"
                                    onClick={()=> console.log("Item click2")}
                                />
                            </MenuItemsGroup>
                        </SubMenu>
                        <MenuItemsGroup>
                            <MenuItem
                                iconAfter={btnAfter}
                                caption="Menu Item1 selected"
                                onSelectChange={setSelected}
                                isSelected={selected}
                                onClick={()=> console.log("Item click1")}
                            />
                            <MenuItem
                                iconBefore={btnBefore}
                                selectableType="check"
                                isSelected={selected}
                                onSelectChange={setSelected}
                                caption="Group Menu Item2"
                                onClick={()=> console.log("Item click2")}
                            />
                        </MenuItemsGroup>
                        <MenuItem
                                iconAfter={btnAfter}
                                caption="Menu Item1 very long long long long long long long long"
                                onClick={()=> console.log("Item click1")}
                            />
                            <MenuItem
                                iconBefore={btnBefore}
                                caption="Menu Item2"
                                onClick={()=> console.log("Item click2")}
                            />
                        <MenuItemsGroup direction="horizontal" title="With horizontal direction">
                            <MenuItem
                                caption="A"
                                onClick={()=> console.log("Item click1")}
                            />
                            <MenuItem
                                caption="B"
                                onClick={()=> console.log("Item click2")}
                            />
                            <MenuItem
                                caption="C"
                                onClick={()=> console.log("Item click2")}
                            />
                        </MenuItemsGroup>
                        <MenuItemsGroup title="Group title">
                            <MenuItem
                                iconBefore={btnBefore}
                                caption="Menu Item2"
                                onClick={()=> console.log("Item click2")}
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
