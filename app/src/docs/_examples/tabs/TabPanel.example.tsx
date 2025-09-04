import { FlexCell, LinkButton, Tabs, Text } from '@epam/uui';
import React, { type ReactNode, type PropsWithChildren, useState } from 'react';

import css from './TabPanel.module.scss';

const getTabpanelId = (tabId: string): string => {
    return `tabpanel-${tabId}`;
};

interface TabPanelProps {
    tabId: string;
}

function TabPanel({
    tabId,
    children,
}: PropsWithChildren<TabPanelProps>): ReactNode {
    return (
        <div
            className={ css.tabPanel }
            id={ getTabpanelId(tabId) }
            role="tabpanel"
            aria-labelledby={ tabId }
        >
            {children}
        </div>
    );
}

export default function TabPanelTabListExample(): ReactNode {
    const [tabId, setTabId] = useState<string>('tab-panel-tab-1');

    const renderTabPanel = (): ReactNode => {
        if (tabId === 'tab-panel-tab-1') {
            return (
                <TabPanel
                    tabId={ tabId }
                >
                    <Text>
                        Tab 1 content
                    </Text>
                </TabPanel>
            );
        }

        if (tabId === 'tab-panel-tab-2') {
            return (
                <TabPanel
                    tabId={ tabId }
                >
                    <Text>
                        Tab 2 content
                    </Text>
                </TabPanel>
            );
        }

        if (tabId === 'tab-panel-tab-3') {
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
            <Tabs
                items={ [
                    {
                        id: 'tab-panel-tab-1',
                        caption: 'Tab 1',
                        rawProps: {
                            'aria-controls': getTabpanelId('tab-panel-tab-1'),
                        },
                    },
                    {
                        id: 'tab-panel-tab-2',
                        caption: 'Tab 2',
                        rawProps: {
                            'aria-controls': getTabpanelId('tab-panel-tab-2'),
                        },
                    },
                    {
                        id: 'tab-panel-tab-3',
                        caption: 'Tab 3',
                        rawProps: {
                            'aria-controls': getTabpanelId('tab-panel-tab-3'),
                        },
                    },
                ] }
                value={ tabId }
                onValueChange={ setTabId }
                rawProps={ {
                    'aria-label': 'Example of a tab list with tab panel',
                } }
            />

            {renderTabPanel()}
        </FlexCell>
    );
}
