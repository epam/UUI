import React from 'react';
import { AdaptivePanel, AdoptiveItemProps } from './AdaptivePanel';
import { Button, Dropdown, FlexRow, Text, DropdownContainer } from "@epam/promo";
import { FlexCell } from "@epam/uui-components";

const items: AdoptiveItemProps[] = [
    { id: 1, render: () => <Button caption='Some preset-99' />, priority: 99 },
    { id: 2, render: () => <Button caption='Administrators-3' />, priority: 4 },
    { id: 3, render: () => <Button caption='Only age more thanfgdgdfgdg 40-1' />, priority: 1 },
    { id: 4, render: () => <Button caption='Managers-2' />, priority: 2 },
    { id: 6, render: () => <Button caption='Senior Admins-11' />, priority: 2 },
    { id: 5, render: (hiddenItems) => <Dropdown
            renderTarget={ (props) => <Button caption='More-10' {...props} /> }
            renderBody={ () => <DropdownContainer><Text>{hiddenItems.map(i => i.render())}</Text></DropdownContainer> }
        />,
        priority: 10, collapsedContainer: true },
];

export const AdaptivePanelDemo = () => {
    const addNewHandler = () => {
        // setChangeState(prev => !prev);
    };

    const addNewButtonEl = <Button
        rawProps={ { style: { flexShrink: "0", minWidth: 'initial' } } }
        key={ Math.random() }
        data-priority={ 100 }
        caption={ `+ Add New` }
        color="blue"
        onClick={ addNewHandler }
    />;

    return (
        <FlexCell grow={ 1 }>
            <FlexRow vPadding='24' padding='6'>
                <Text font='sans-semibold' size='48'>Adaptive Panel MVP</Text>
            </FlexRow>
            <AdaptivePanel items={ items } />
        </FlexCell>
    );
}