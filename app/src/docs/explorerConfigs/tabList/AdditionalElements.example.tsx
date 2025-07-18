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

const getTabpanelId = (tabId: TabId): string => {
    return `tabpanel-${tabId}`;
};

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
            id={ getTabpanelId(tabId) }
            role="tabpanel"
            aria-labelledby={ tabId }
            tabIndex={ tabIndex }
        >
            {children}
        </div>
    );
}

export default function AdditionalElementsTabListExample(): ReactNode {
    const [tabId, setTabId] = useState<TabId>('tab-additional-elements-1');
    const [search, setSearch] = useState('');

    const renderTabPanel = (): ReactNode => {
        if (tabId === 'tab-additional-elements-1') {
            return (
                <TabPanel
                    tabId={ tabId }
                    tabIndex={ 0 }
                >
                    <Text>
                        Tab 1 content
                    </Text>
                </TabPanel>
            );
        }

        if (tabId === 'tab-additional-elements-2') {
            return (
                <TabPanel
                    tabId={ tabId }
                    tabIndex={ 0 }
                >
                    <Text>
                        Tab 2 content
                    </Text>
                </TabPanel>
            );
        }

        if (tabId === 'tab-additional-elements-3') {
            return (
                <TabPanel
                    tabId={ tabId }
                >
                    <LinkButton
                        caption="Google"
                        href="https://google.com"
                    />

                    <Text>
                        Tab 3 content
                    </Text>
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
                    size="36"
                />

                <TabList
                    items={ [
                        {
                            id: 'tab-additional-elements-1',
                            caption: 'Tab 1',
                            rawProps: {
                                'aria-controls': getTabpanelId('tab-additional-elements-1'),
                            },
                        },
                        {
                            id: 'tab-additional-elements-2',
                            caption: 'Tab 2',
                            rawProps: {
                                'aria-controls': getTabpanelId('tab-additional-elements-2'),
                            },
                        },
                        {
                            id: 'tab-additional-elements-3',
                            caption: 'Tab 3',
                            rawProps: {
                                'aria-controls': getTabpanelId('tab-additional-elements-3'),
                            },
                        },
                    ] }
                    value={ tabId }
                    onValueChange={ setTabId }
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
