import React, { useState } from 'react';
import { AdaptiveItemProps, AdaptivePanel } from '@epam/uui-components';
import {
    Button, Dropdown, DropdownContainer, FlexCell, Slider, VerticalTabButton,
} from '@epam/promo';
import css from './Basic.example.scss';

export default function BasicAdaptivePanelExample() {
    const [width, setWidth] = useState<number>(100);

    const renderItem = (item: AdaptiveItemProps<{ data?: { caption: string } }>) => {
        return (
            <div>
                <Button cx={ css.itemWithMargins } caption={ item.data.caption } />
            </div>
        );
    };

    const items: AdaptiveItemProps<{ data?: { caption: string } }>[] = [
        {
            id: '2', render: renderItem, priority: 1, data: { caption: 'Administrators' },
        },
        {
            id: '3', render: renderItem, priority: 1, data: { caption: 'Developers' },
        },
        {
            id: '4', render: renderItem, priority: 2, data: { caption: 'Managers' },
        },
        {
            id: '6', render: renderItem, priority: 3, data: { caption: 'Senior Admins' },
        },
        {
            id: '7', render: renderItem, priority: 4, data: { caption: 'Consultants' },
        },
        {
            id: '8', render: renderItem, priority: 5, data: { caption: 'Architects' },
        },
        {
            id: '5',
            render: (item, hiddenItems) => (
                <Dropdown
                    renderTarget={ (props) => <Button caption="Hidden items" { ...props } /> }
                    renderBody={ () => (
                        <DropdownContainer>
                            {hiddenItems.map((i) => (
                                <VerticalTabButton caption={ i.data.caption } />
                            ))}
                        </DropdownContainer>
                    ) }
                />
            ),
            priority: 10,
            collapsedContainer: true,
        },
    ];

    return (
        <FlexCell grow={ 1 }>
            <Slider value={ width } onValueChange={ setWidth } min={ 0 } max={ 100 } step={ 1 } />

            <div style={ { width: `${width}%`, marginTop: 12 } }>
                <AdaptivePanel items={ items } />
            </div>
        </FlexCell>
    );
}
