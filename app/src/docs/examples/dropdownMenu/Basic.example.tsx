import * as React from 'react';
import { Dropdown } from '@epam/uui-components';
import { Button,
    DropdownMenuBody,
    MenuItem,
    MenuItemsGroup, SubMenu } from '@epam/promo';
import { systemIcons } from '@epam/promo/icons/icons';

const { calendar: btnBefore, info: btnAfter } = systemIcons["36"];

export function BasicDropdownExample() {
    const renderDropdownBody = () => {
        const [selected, setSelected] = React.useState(false);
        const clickAnalyticsEvent = {
            name: "DropdownMenu Item click",
            category: "docs",
            label: "static_event",
            value: selected ? "selected" : "unselected"
        }

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
    };

    return (
        <>
            <Dropdown
                renderBody={ () => renderDropdownBody() }
                renderTarget={ (props: any) => <Button caption='Click to open' { ...props } /> }
            />

            {/* <Dropdown
                renderBody={ () => renderDropdownBody() }
                renderTarget={ (props: any) => <Button caption='Hover to open' { ...props } /> }
                openOnHover={ true }
                closeOnMouseLeave='toggler'
            /> */}
        </>
    );
}