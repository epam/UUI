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

export default function HorizontalLayoutTabListExample(): ReactNode {
    const [tabId, setTabId] = useState<TabId>('tab-horizontal-1');

    const renderTabPanel = (): ReactNode => {
        if (tabId === 'tab-horizontal-1') {
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

        if (tabId === 'tab-horizontal-2') {
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

        if (tabId === 'tab-horizontal-3') {
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
                        id: 'tab-horizontal-1',
                        caption: 'Tab 1',
                        rawProps: {
                            'aria-controls': getTabpanelId('tab-horizontal-1'),
                        },
                    },
                    {
                        id: 'tab-horizontal-2',
                        caption: 'Tab 2',
                        rawProps: {
                            'aria-controls': getTabpanelId('tab-horizontal-2'),
                        },
                    },
                    {
                        id: 'tab-horizontal-3',
                        caption: 'Tab 3',
                        rawProps: {
                            'aria-controls': getTabpanelId('tab-horizontal-3'),
                        },
                    },
                ] }
                value={ tabId }
                onValueChange={ setTabId }
                rawProps={ {
                    'aria-label': 'Horizontal tab list example',
                } }
            />

            {renderTabPanel()}
        </FlexCell>
    );
}
