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
    const [value, onValueChange] = useState<TabId>('tab-vertical-1');

    const renderTabPanel = (): ReactNode => {
        if (value === 'tab-vertical-1') {
            return (
                <TabPanel
                    tabId={ value }
                    tabIndex={ 0 }
                >
                    <Text>Tab 1 content</Text>
                </TabPanel>
            );
        }

        if (value === 'tab-vertical-2') {
            return (
                <TabPanel
                    tabId={ value }
                    tabIndex={ 0 }
                >
                    <Text>Tab 2 content</Text>
                </TabPanel>
            );
        }

        if (value === 'tab-vertical-3') {
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
                alignItems="flex-start"
            >
                <TabList
                    items={ [
                        {
                            id: 'tab-vertical-1',
                            caption: 'Tab 1',
                        },
                        {
                            id: 'tab-vertical-2',
                            caption: 'Tab 2',
                        },
                        {
                            id: 'tab-vertical-3',
                            caption: 'Tab 3',
                        },
                    ] }
                    direction="vertical"
                    value={ value }
                    onValueChange={ onValueChange }
                    rawProps={ {
                        'aria-label': 'Vertical tab list example',
                    } }
                />

                {renderTabPanel()}
            </FlexRow>
        </FlexCell>
    );
}
