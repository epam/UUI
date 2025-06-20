import {
    FlexCell,
    FlexRow,
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
        <FlexCell
            grow={ 1 }
        >
            <div
                className={ css.tabPanel }
                id={ `tabpanel-${tabId}` }
                role="tabpanel"
                aria-labelledby={ tabId }
                tabIndex={ tabIndex }
            >
                {children}
            </div>
        </FlexCell>
    );
}

export default function VerticalLayoutTabListExample(): ReactNode {
    const [tabId, setTabId] = useState<TabId>('tab-vertical-1');

    const renderTabPanel = (): ReactNode => {
        if (tabId === 'tab-vertical-1') {
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

        if (tabId === 'tab-vertical-2') {
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

        if (tabId === 'tab-vertical-3') {
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
                alignItems="flex-start"
            >
                <TabList
                    items={ [
                        {
                            id: 'tab-vertical-1',
                            caption: 'Tab 1',
                            rawProps: {
                                'aria-controls': getTabpanelId('tab-vertical-1'),
                            },
                        },
                        {
                            id: 'tab-vertical-2',
                            caption: 'Tab 2',
                            rawProps: {
                                'aria-controls': getTabpanelId('tab-vertical-2'),
                            },
                        },
                        {
                            id: 'tab-vertical-3',
                            caption: 'Tab 3',
                            rawProps: {
                                'aria-controls': getTabpanelId('tab-vertical-3'),
                            },
                        },
                    ] }
                    direction="vertical"
                    value={ tabId }
                    onValueChange={ setTabId }
                    rawProps={ {
                        'aria-label': 'Vertical tab list example',
                    } }
                />

                {renderTabPanel()}
            </FlexRow>
        </FlexCell>
    );
}
