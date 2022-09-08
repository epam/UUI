import React from 'react';
import { AdaptivePanel, AdoptiveItemProps } from './AdaptivePanel';
import { Button, FlexRow, Text } from "@epam/promo";
import { FlexCell } from "@epam/uui-components";

const items: AdoptiveItemProps[] = [
    { id: 5, render: () => <Button caption='More' />, priority: 10, collapsedContainer: true },
    { id: 1, render: () => <Button caption='Some preset' />, priority: 99 },
    { id: 2, render: () => <Button caption='Administrators' />, priority: 4 },
    { id: 3, render: () => <Button caption='Only age more 40' />, priority: 1 },
    { id: 4, render: () => <Button caption='Managers' />, priority: 2 },
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