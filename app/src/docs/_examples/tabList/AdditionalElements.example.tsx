import {
    Avatar,
    FlexCell,
    FlexRow,
    LinkButton,
    SearchInput,
    type TabId,
    TabList,
    Text,
} from '@epam/uui';
import React, {
    type ReactNode,
    type PropsWithChildren,
    useState,
} from 'react';

import css from './TabPanel.module.scss';

interface TabPanelProps {
    tabId: TabId;
    tabIndex?: number;
}

function TabPanel({
    tabId,
    tabIndex,
    children,
}: PropsWithChildren<TabPanelProps>): ReactNode {
    return (
        <div
            className={ css.tabPanel }
            id={ `tabpanel-${tabId}` }
            role="tabpanel"
            aria-labelledby={ tabId }
            tabIndex={ tabIndex }
        >
            {children}
        </div>
    );
}

export default function HorizontalTabListExample(): ReactNode {
    const [value, onValueChange] = useState<TabId>('tab-additional-elements-1');
    const [search, setSearch] = useState('');

    const renderTabPanel = (): ReactNode => {
        if (value === 'tab-additional-elements-1') {
            return (
                <TabPanel
                    tabId={ value }
                    tabIndex={ 0 }
                >
                    <Text>Tab 1 content</Text>
                </TabPanel>
            );
        }

        if (value === 'tab-additional-elements-2') {
            return (
                <TabPanel
                    tabId={ value }
                    tabIndex={ 0 }
                >
                    <Text>Tab 2 content</Text>
                </TabPanel>
            );
        }

        if (value === 'tab-additional-elements-3') {
            return (
                <TabPanel tabId={ value }>
                    <LinkButton
                        caption="Google"
                        href="https://google.com"
                    />

                    <Text>Tab 3 content</Text>
                </TabPanel>
            );
        }

        return null;
    };

    return (
        <FlexCell
            grow={ 1 }
        >
            <FlexRow
                columnGap="12"
                justifyContent="space-between"
                borderBottom={ true }
            >
                <Avatar
                    alt="avatar"
                    img="https://api.dicebear.com/7.x/pixel-art/svg?seed=Coco&radius=50&backgroundColor=b6e3f4"
                    size="42"
                />

                <TabList
                    items={ [
                        {
                            id: 'tab-additional-elements-1',
                            caption: 'Tab 1',
                        },
                        {
                            id: 'tab-additional-elements-2',
                            caption: 'Tab 2',
                        },
                        {
                            id: 'tab-additional-elements-3',
                            caption: 'Tab 3',
                        },
                    ] }
                    value={ value }
                    onValueChange={ onValueChange }
                    borderBottom={ false }
                    rawProps={ {
                        'aria-label': 'Additional elements tab list example',
                    } }
                />

                <FlexCell
                    width={ 200 }
                >
                    <SearchInput
                        value={ search }
                        onValueChange={ setSearch }
                        placeholder="Type for search"
                    />
                </FlexCell>
            </FlexRow>

            {renderTabPanel()}
        </FlexCell>
    );
}
