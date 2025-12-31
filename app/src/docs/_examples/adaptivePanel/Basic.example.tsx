import React, { useState } from 'react';
import { AdaptiveItemProps, AdaptivePanel } from '@epam/uui-components';
import { Button, Dropdown, FlexCell, VerticalTabButton, Slider, DropdownMenuBody } from '@epam/uui';

export default function BasicAdaptivePanelExample() {
    const [width, setWidth] = useState<number>(100);
    const [value, onValueChange] = useState('');

    const renderItem = (item: AdaptiveItemProps<{ data?: { caption: string } }>) => {
        return (
            <Button key={ item.id } caption={ item.data.caption } onClick={ () => {} } />
        );
    };

    const items: AdaptiveItemProps<{ data?: { caption: string } }>[] = [
        {
            id: '2', render: renderItem, priority: 1, data: { caption: 'Administrators' },
        }, {
            id: '3', render: renderItem, priority: 1, data: { caption: 'Developers' },
        }, {
            id: '4', render: renderItem, priority: 2, data: { caption: 'Managers' },
        }, {
            id: '6', render: renderItem, priority: 3, data: { caption: 'Senior Admins' },
        }, {
            id: '7', render: renderItem, priority: 4, data: { caption: 'Consultants' },
        }, {
            id: '8', render: renderItem, priority: 5, data: { caption: 'Architects' },
        }, {
            id: '5',
            render: (item, hiddenItems) => (
                <Dropdown
                    renderTarget={ (props) => <Button caption="Hidden items" { ...props } /> }
                    renderBody={ (props) => (
                        <DropdownMenuBody { ...props }>
                            {hiddenItems.map((i) => (
                                <VerticalTabButton
                                    caption={ i.data.caption }
                                    onClick={ () => onValueChange(i.data.caption) }
                                    isActive={ i.data.caption === value }
                                    size="36"
                                />
                            ))}
                        </DropdownMenuBody>
                    ) }
                />
            ),
            priority: 10,
            collapsedContainer: true,
        },
    ];

    return (
        <FlexCell grow={ 1 } style={ { padding: 12 } }>
            <Slider value={ width } onValueChange={ setWidth } min={ 0 } max={ 100 } step={ 1 } />

            <div style={ { width: `${width}%`, marginTop: 12 } }>
                <AdaptivePanel itemsGap="6" items={ items } />
            </div>
        </FlexCell>
    );
}
