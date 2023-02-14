import React from 'react';

import {
    createPluginFactory,
    getPluginType,
    BlockToolbarButton,
    PlateEditor,
    getBlockAbove,
} from '@udecode/plate';

import { ToolbarButton  } from '../../implementation/ToolbarButton';
import { isPluginActive } from '../../../helpers';

import { ReactComponent as ToDoIcon } from '../../icons/to-do.svg';

import { ToDoItem } from './ToDoItem';

const KEY = 'toDoItem';

export const toDoListPlugin = () => {
    const createToDoListPlugin = createPluginFactory({
        key: KEY,
        isElement: true,
        component: ToDoItem,
    });

    return createToDoListPlugin();
};

interface ToolbarButton {
    editor: PlateEditor;
}

export const ToDoListButton = ({ editor }: ToolbarButton) => {
    if (!isPluginActive(KEY)) return null;

    const block = getBlockAbove(editor);

    return (
        <BlockToolbarButton
            styles={ { root: {width: 'auto', cursor: 'pointer', padding: '0px' }} }
            type={ getPluginType(editor, KEY) }
            icon={ <ToolbarButton
                onClick={ () => {} }
                icon={ ToDoIcon }
                isActive={ !!editor?.selection && block?.length && block[0].type === KEY }
            /> }
        />
    );
};
