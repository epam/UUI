import React, { useState } from 'react';
import { FlexCell, MultiSwitch, Text } from '@epam/uui';

import { ReactComponent as TableIcon } from '@epam/assets/icons/content-view_table-outline.svg';
import { ReactComponent as GridIcon } from '@epam/assets/icons/content-view_grid-fill.svg';
import { ReactComponent as DetailsIcon } from '@epam/assets/icons/content-view_detailes-fill.svg';
import { ReactComponent as StarIcon } from '@epam/assets/icons/communication-star-fill.svg';
import { ReactComponent as ClockIcon } from '@epam/assets/icons/action-schedule-outline.svg';
import { ReactComponent as ChatIcon } from '@epam/assets/icons/communication-chat-outline.svg';

import css from './BasicExample.module.scss';

export default function BasicExample() {
    const [value, onValueChange] = useState(null);
    const [view, setView] = useState(null);
    const [filter, setFilter] = useState(null);

    return (
        <FlexCell width="auto" cx={ css.container }>
            <Text>With Blue border</Text>
            <MultiSwitch
                items={ [{ id: 'on', caption: 'On' }, { id: 'off', caption: 'Off' }] }
                value={ value }
                onValueChange={ onValueChange }
            />
            <MultiSwitch
                size="36"
                items={ [
                    { id: 1, caption: 'Mentee' }, { id: 2, caption: 'Mentor' }, { id: 3, caption: 'Coordinator' },
                ] }
                value={ value }
                onValueChange={ onValueChange }
            />
            <Text>With Grey border</Text>
            <MultiSwitch
                size="36"
                items={ [
                    { id: 1, caption: 'Mentee' }, { id: 2, caption: 'Mentor' }, { id: 3, caption: 'Coordinator' },
                ] }
                color="secondary"
                value={ value }
                onValueChange={ onValueChange }
            />
            <Text>Disabled</Text>
            <MultiSwitch
                items={ [
                    { id: 1, caption: 'Mentee' }, { id: 2, caption: 'Mentor' }, { id: 3, caption: 'Coordinator' },
                ] }
                value={ value }
                onValueChange={ onValueChange }
                isDisabled
            />
            <Text>Icon only</Text>
            <MultiSwitch
                items={ [
                    { id: 1, icon: TableIcon }, { id: 2, icon: GridIcon }, { id: 3, icon: DetailsIcon },
                ] }
                value={ view }
                onValueChange={ setView }
            />
            <Text>Icon + Label</Text>
            <MultiSwitch
                items={ [
                    { id: 1, icon: StarIcon, caption: 'Starred' }, { id: 2, icon: ClockIcon, caption: 'Latest' }, { id: 3, icon: ChatIcon, caption: 'All chats' },
                ] }
                value={ filter }
                onValueChange={ setFilter }
            />
        </FlexCell>
    );
}
