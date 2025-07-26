import React, { useState, useCallback } from 'react';
import {
    VerticalTabButton,
    Panel,
    FlexSpacer,
    IconButton,
    Dropdown,
    DropdownMenuButton,
    DropdownMenuBody,
} from '@epam/uui';
import { ReactComponent as MoreIcon } from '@epam/assets/icons/navigation-more_vert-outline.svg';
import { ReactComponent as DeleteIcon } from '@epam/assets/icons/action-delete-fill.svg';
import { ReactComponent as ExportIcon } from '@epam/assets/icons/file-export-outline.svg';

interface Task {
    id: number;
    name: string;
    hasNotifications?: boolean;
    isFavorite?: boolean;
}

const tasks: Task[] = [
    { id: 1, name: 'Infrastructure' },
    { id: 2, name: 'Shared services' },
    { id: 3, name: 'UUI Customization' },
    { id: 4, name: 'Shared Components' },
    { id: 5, name: 'Pages Template Components' },
    { id: 6, name: 'Pages' },
];

export default function SimpleNavigation() {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const renderAddons = useCallback(() => {
        return (
            <>
                <FlexSpacer />
                <Dropdown
                    renderTarget={
                        (props) => (
                            <IconButton
                                { ...props }
                                icon={ MoreIcon }
                                size="24"
                                color="secondary"
                            />
                        )
                    }
                    renderBody={
                        (props) => (
                            <DropdownMenuBody { ...props }>
                                <DropdownMenuButton caption="Export" icon={ ExportIcon } onClick={ () => {} } />
                                <DropdownMenuButton caption="Delete" icon={ DeleteIcon } onClick={ () => {} } />
                            </DropdownMenuBody>
                        )
                    }
                />
            </>
        );
    }, []);

    return (
        <Panel shadow>
            {tasks.map((task) => (
                <VerticalTabButton
                    key={ task.id }
                    caption={ task.name }
                    isActive={ selectedId === task.id }
                    onClick={ () => setSelectedId(task.id) }
                    size="36"
                    renderAddons={ renderAddons }
                />
            ))}
        </Panel>
    );
}
