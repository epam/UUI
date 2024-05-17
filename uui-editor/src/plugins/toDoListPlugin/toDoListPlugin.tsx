import React from 'react';

import { useIsPluginActive } from '../../helpers';
import { ToolbarButton } from '../../implementation/ToolbarButton';

import { ReactComponent as ToDoIcon } from '../../icons/to-do.svg';

import {
    PlateEditor, focusEditor, getBlockAbove, toggleNodeType,
} from '@udecode/plate-common';
import { ELEMENT_TODO_LI, createTodoListPlugin } from '@udecode/plate-list';
import { ToDoItem } from './ToDoItem';
import { WithToolbarButton } from '../../implementation/Toolbars';

export const TODO_ELEMENT_KEY = 'toDoItem';

export const toDoListPlugin = () => {
    // TODO: implement withOverrides for toggling between lists and todo lists
    return createTodoListPlugin<WithToolbarButton>({
        overrideByKey: {
            [ELEMENT_TODO_LI]: {
                key: TODO_ELEMENT_KEY,
                type: TODO_ELEMENT_KEY,
                component: ToDoItem,
            },
        },
        options: {
            bottomBarButton: ToDoListButton,
        },
    });
};

interface IToolbarButton {
    editor: PlateEditor;
}

export function ToDoListButton({ editor }: IToolbarButton) {
    if (!useIsPluginActive(TODO_ELEMENT_KEY)) return null;

    const block = getBlockAbove(editor);

    const onToDoListButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, type: string) => {
        e.preventDefault();
        e.stopPropagation();

        toggleNodeType(editor, { activeType: type });
        focusEditor(editor);
    };

    return (
        <ToolbarButton
            onClick={ (e) => onToDoListButtonClick(e, TODO_ELEMENT_KEY) }
            icon={ ToDoIcon }
            isActive={ !!editor?.selection && block?.length && block[0].type === TODO_ELEMENT_KEY }
        />
    );
}
