import React, { AriaRole, useState } from 'react';
import {
    FlexCell, MainMenu, MainMenuButton, MainMenuDropdown, Slider,
} from '@epam/uui';
import { AdaptiveItemProps } from '@epam/uui-components';

export default function MainMenuBasicExample() {
    const [width, setWidth] = useState<number>(100);

    const getMenuItems = (): AdaptiveItemProps<{ role?: AriaRole }>[] => {
        return [
            {
                id: 'people',
                priority: 7,
                render: (item) => {
                    return (
                        <MainMenuButton
                            key={ item.id }
                            href="/"
                            caption="People"
                            rawProps={ {
                                role: item.role,
                            } }
                        />
                    );
                },
            },
            {
                id: 'projects',
                priority: 7,
                render: (item) => {
                    return (
                        <MainMenuButton
                            key={ item.id }
                            href="/"
                            caption="Projects"
                            rawProps={ {
                                role: item.role,
                            } }
                        />
                    );
                },
            },
            {
                id: 'positions',
                priority: 6,
                render: (item) => {
                    return (
                        <MainMenuButton
                            key={ item.id }
                            href="/"
                            caption="Positions"
                            rawProps={ {
                                role: item.role,
                            } }
                        />
                    );
                },
            },
            {
                id: 'companies',
                priority: 5,
                render: (item) => {
                    return (
                        <MainMenuButton
                            key={ item.id }
                            href="/"
                            caption="Companies"
                            rawProps={ {
                                role: item.role,
                            } }
                        />
                    );
                },
            },
            {
                id: 'processes',
                priority: 5,
                render: (item) => {
                    return (
                        <MainMenuButton
                            key={ item.id }
                            href="/"
                            caption="Processes"
                            rawProps={ {
                                role: item.role,
                            } }
                        />
                    );
                },
            },
            {
                id: 'tasks',
                priority: 4,
                render: (item) => {
                    return (
                        <MainMenuButton
                            key={ item.id }
                            href="/"
                            caption="Tasks"
                            rawProps={ {
                                role: item.role,
                            } }
                        />
                    );
                },
            },
            {
                id: 'talks',
                priority: 4,
                render: (item) => {
                    return (
                        <MainMenuButton
                            key={ item.id }
                            href="/"
                            caption="Talks"
                            rawProps={ {
                                role: item.role,
                            } }
                        />
                    );
                },
            },
            {
                id: 'trainingCatalog',
                priority: 3,
                render: (item) => {
                    return (
                        <MainMenuButton
                            key={ item.id }
                            href="/"
                            caption="Training Catalog"
                            rawProps={ {
                                role: item.role,
                            } }
                        />
                    );
                },
            },
            {
                id: 'requests',
                priority: 3,
                render: (item) => {
                    return (
                        <MainMenuButton
                            key={ item.id }
                            href="/"
                            caption="Requests"
                            rawProps={ {
                                role: item.role,
                            } }
                        />
                    );
                },
            },
            {
                id: 'moreContainer',
                priority: 9,
                collapsedContainer: true,
                render: (item, hiddenItems = []) => (
                    <MainMenuDropdown
                        caption="More"
                        key={ item.id }
                        renderBody={ () => {
                            return hiddenItems.map((hiddenItem) => {
                                return hiddenItem.render({
                                    ...hiddenItem,
                                    role: 'menuitem',
                                });
                            });
                        } }
                    />
                ),
            },
        ];
    };

    return (
        <FlexCell grow={ 1 }>
            <Slider value={ width } onValueChange={ setWidth } min={ 0 } max={ 100 } step={ 1 } />

            <div style={ { width: `${width}%`, marginTop: 12 } }>
                <MainMenu items={ getMenuItems() } />
            </div>
        </FlexCell>
    );
}
