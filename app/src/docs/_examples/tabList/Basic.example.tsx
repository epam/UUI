import { FlexCell, TabList } from '@epam/uui';
import React, { type ReactNode, useState } from 'react';

export default function BasicTabListExample(): ReactNode {
    const [tabId, setTabId] = useState<string>('basic-tab-1');

    return (
        <FlexCell
            grow={ 1 }
        >
            <TabList
                items={ [
                    {
                        id: 'basic-tab-1',
                        caption: 'Tab 1',
                    },
                    {
                        id: 'basic-tab-2',
                        caption: 'Tab 2',
                    },
                    {
                        id: 'basic-tab-3',
                        caption: 'Tab 3',
                    },
                ] }
                value={ tabId }
                onValueChange={ setTabId }
                rawProps={ {
                    'aria-label': 'Basic tab list example',
                } }
            />
        </FlexCell>
    );
}
