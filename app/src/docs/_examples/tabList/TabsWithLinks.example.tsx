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
    useEffect,
} from 'react';

import css from './TabPanel.module.scss';
import { useSearchParams } from 'react-router-dom';

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

export default function TabsWithLinksTabListExample(): ReactNode {
    const [searchParams] = useSearchParams();
    const [value, onValueChange] = useState<TabId>('');

    useEffect(
        () => {
            const tabId = searchParams.get('tabId');

            onValueChange(tabId);
        },
        [
            searchParams,
        ],
    );

    const renderTabPanel = (): ReactNode => {
        if (value === 'tab-links-1') {
            return (
                <TabPanel
                    tabId={ value }
                    tabIndex={ 0 }
                >
                    <Text>Tab 1 content</Text>
                </TabPanel>
            );
        }

        if (value === 'tab-links-2') {
            return (
                <TabPanel
                    tabId={ value }
                    tabIndex={ 0 }
                >
                    <Text>Tab 2 content</Text>
                </TabPanel>
            );
        }

        if (value === 'tab-links-3') {
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
                        id: 'tab-links-1',
                        caption: 'Tab 1',
                        link: {
                            pathname: '/documents',
                            query: {
                                id: 'tabList',
                                mode: 'doc',
                                category: 'components',
                                tabId: 'tab-links-1',
                            },
                        },
                    },
                    {
                        id: 'tab-links-2',
                        caption: 'Tab 2',
                        link: {
                            pathname: '/documents',
                            query: {
                                id: 'tabList',
                                mode: 'doc',
                                category: 'components',
                                tabId: 'tab-links-2',
                            },
                        },
                    },
                    {
                        id: 'tab-links-3',
                        caption: 'Tab 3',
                        link: {
                            pathname: '/documents',
                            query: {
                                id: 'tabList',
                                mode: 'doc',
                                category: 'components',
                                tabId: 'tab-links-3',
                            },
                        },
                    },
                ] }
                value={ value }
                onValueChange={ onValueChange }
                rawProps={ {
                    'aria-label': 'Tab list with links example',
                } }
            />

            {renderTabPanel()}
        </FlexCell>
    );
}
