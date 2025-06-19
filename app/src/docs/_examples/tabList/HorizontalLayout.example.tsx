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

export default function HorizontalLayoutTabListExample(): ReactNode {
    const [value, onValueChange] = useState<TabId>('tab-horizontal-1');

    const renderTabPanel = (): ReactNode => {
        if (value === 'tab-horizontal-1') {
            return (
                <TabPanel
                    tabId={ value }
                    tabIndex={ 0 }
                >
                    <Text>Tab 1 content</Text>
                </TabPanel>
            );
        }

        if (value === 'tab-horizontal-2') {
            return (
                <TabPanel
                    tabId={ value }
                    tabIndex={ 0 }
                >
                    <Text>Tab 2 content</Text>
                </TabPanel>
            );
        }

        if (value === 'tab-horizontal-3') {
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
            <TabList
                items={ [
                    {
                        id: 'tab-horizontal-1',
                        caption: 'Tab 1',
                    },
                    {
                        id: 'tab-horizontal-2',
                        caption: 'Tab 2',
                    },
                    {
                        id: 'tab-horizontal-3',
                        caption: 'Tab 3',
                    },
                ] }
                value={ value }
                onValueChange={ onValueChange }
                rawProps={ {
                    'aria-label': 'Horizontal tab list example',
                } }
            />

            {renderTabPanel()}
        </FlexCell>
    );
}
