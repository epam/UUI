import React from 'react';

import {
    getPluginType,
    BlockToolbarButton,
    PlateEditor,
    getBlockAbove,
    createTodoListPlugin,
    ELEMENT_TODO_LI,
} from '@udecode/plate';

import { ToolbarButton } from '../../implementation/ToolbarButton';
import { isPluginActive } from '../../../helpers';

import { ReactComponent as ToDoIcon } from '../../icons/to-do.svg';

import { ToDoItem } from './ToDoItem';

const TODO_ELEMENT_KEY = 'toDoItem';

export const toDoListPlugin = () => {
    // TODO: implement withOverrides for toggling between lists and todo lists
    return createTodoListPlugin({
        overrideByKey: {
            [ELEMENT_TODO_LI]: {
                type: TODO_ELEMENT_KEY,
                component: ToDoItem
            }
        }
    });
};

interface ToolbarButton {
    editor: PlateEditor;
}

export const ToDoListButton = ({ editor }: ToolbarButton) => {
    if (!isPluginActive(ELEMENT_TODO_LI)) return null;

    const block = getBlockAbove(editor);

    return (
        <BlockToolbarButton
            styles={ { root: { width: 'auto', cursor: 'pointer', padding: '0px' } } }
            type={ getPluginType(editor, ELEMENT_TODO_LI) }
            actionHandler='onMouseDown'
            icon={ <ToolbarButton
                onClick={ () => {} }
                icon={ ToDoIcon }
                isActive={ !!editor?.selection && block?.length && block[0].type === ELEMENT_TODO_LI }
            /> }
        />
    );
};
