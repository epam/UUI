import {
    FlexCell,
    LinkButton,
    type TabId,
    TabList,
    Text,
} from '@epam/uui';
import React, {
    type ReactNode,
    type PropsWithChildren,
} from 'react';

import css from './TabPanel.module.scss';
import { useSearchParams } from 'react-router-dom';

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

export default function TabsWithLinksTabListExample(): ReactNode {
    const [searchParams] = useSearchParams();
    const tabId = (
        searchParams.get('tabId')
        ?? 'tab-with-links-1'
    );

    const renderTabPanel = (): ReactNode => {
        if (tabId === 'tab-with-links-1') {
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

        if (tabId === 'tab-with-links-2') {
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

        if (tabId === 'tab-with-links-3') {
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
            <TabList
                items={ [
                    {
                        id: 'tab-with-links-1',
                        caption: 'Tab 1',
                        link: {
                            pathname: '/documents',
                            query: {
                                id: 'tabList',
                                mode: 'doc',
                                category: 'components',
                                tabId: 'tab-with-links-1',
                            },
                        },
                        rawProps: {
                            'aria-controls': getTabpanelId('tab-with-links-1'),
                        },
                    },
                    {
                        id: 'tab-with-links-2',
                        caption: 'Tab 2',
                        link: {
                            pathname: '/documents',
                            query: {
                                id: 'tabList',
                                mode: 'doc',
                                category: 'components',
                                tabId: 'tab-with-links-2',
                            },
                        },
                        rawProps: {
                            'aria-controls': getTabpanelId('tab-with-links-2'),
                        },
                    },
                    {
                        id: 'tab-with-links-3',
                        caption: 'Tab 3',
                        link: {
                            pathname: '/documents',
                            query: {
                                id: 'tabList',
                                mode: 'doc',
                                category: 'components',
                                tabId: 'tab-with-links-3',
                            },
                        },
                        rawProps: {
                            'aria-controls': getTabpanelId('tab-with-links-3'),
                        },
                    },
                ] }
                value={ tabId }
                onValueChange={ () => {} }
                rawProps={ {
                    'aria-label': 'Tab list with links example',
                } }
            />

            {renderTabPanel()}
        </FlexCell>
    );
}
