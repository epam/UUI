import React from 'react';
import { Button, Dropdown, FlexRow, Text, DropdownContainer } from '@epam/promo';
import { FlexCell, AdaptivePanel, AdaptiveItemProps } from '@epam/uui-components';

const items: AdaptiveItemProps<{ data?: { name: string } }>[] = [
    // { id: '1', render: (hiddenItems) => <Dropdown
    //         renderTarget={ (props) => <Button caption='More-99' { ...props } /> }
    //         renderBody={ () => <DropdownContainer><Text>{ hiddenItems.map(i => i.render()) }</Text></DropdownContainer> }
    //     />,
    //     collapsedContainer: true, priority: 99 },
    { id: '2', render: () => <Button caption="Administrators-4" />, priority: 4 },
    { id: '3', render: () => <Button caption="Only age more thanfgdgdfgdg 40-1" />, priority: 1 },
    { id: '4', render: () => <Button caption="Managers-2" />, priority: 2 },
    { id: '6', render: () => <Button caption="Senior Admins-11" />, priority: 11 },
    { id: '7', render: () => <Button caption="Senior Admins-12" />, priority: 12 },
    { id: '8', render: () => <Button caption="Senior Admins-13" />, priority: 13 },
    {
        id: '5',
        render: (item, hiddenItems) => (
            <Dropdown
                renderTarget={(props) => <Button caption="More-10" {...props} />}
                renderBody={() => (
                    <DropdownContainer>
                        <Text>{hiddenItems.map((i) => i.render(item, hiddenItems))}</Text>
                    </DropdownContainer>
                )}
            />
        ),
        priority: 10,
        collapsedContainer: true,
    },
];

export const AdaptivePanelDemo = () => {
    const addNewHandler = () => {
        // setChangeState(prev => !prev);
    };

    const addNewButtonEl = (
        <Button
            rawProps={{ style: { flexShrink: '0', minWidth: 'initial' } }}
            key={Math.random()}
            data-priority={100}
            caption={`+ Add New`}
            color="blue"
            onClick={addNewHandler}
        />
    );

    return (
        <FlexCell grow={1}>
            <FlexRow vPadding="24" padding="6">
                <Text font="sans-semibold" size="48">
                    Adaptive Panel MVP
                </Text>
            </FlexRow>
            <AdaptivePanel items={items} />
        </FlexCell>
    );
};
