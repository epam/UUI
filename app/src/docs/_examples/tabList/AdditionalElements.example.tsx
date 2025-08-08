import { Avatar, FlexCell, FlexRow, SearchInput, TabList } from '@epam/uui';
import React, { type ReactNode, useState } from 'react';

export default function AdditionalElementsTabListExample(): ReactNode {
    const [tabId, setTabId] = useState<string>('additional-elements-tab-1');
    const [search, setSearch] = useState('');

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
                            id: 'additional-elements-tab-1',
                            caption: 'Tab 1',
                        },
                        {
                            id: 'additional-elements-tab-2',
                            caption: 'Tab 2',
                        },
                        {
                            id: 'additional-elements-tab-3',
                            caption: 'Tab 3',
                        },
                    ] }
                    value={ tabId }
                    onValueChange={ setTabId }
                    borderBottom={ false }
                    rawProps={ {
                        'aria-label': 'Example of a tab list with additional elements',
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
        </FlexCell>
    );
}
