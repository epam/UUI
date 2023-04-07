import React from 'react';

import {
    createPluginFactory,
    getPluginType,
    BlockToolbarButton,
    PlateEditor,
    getBlockAbove,
    insertEmptyElement,
    getAboveNode,
} from '@udecode/plate';

import { ToolbarButton } from '../../implementation/ToolbarButton';
import { isPluginActive } from '../../../helpers';

import { ReactComponent as ToDoIcon } from '../../icons/to-do.svg';

import { ToDoItem } from './ToDoItem';

const KEY = 'toDoItem';

export const toDoListPlugin = () => {
    const createToDoListPlugin = createPluginFactory({
        key: KEY,
        isElement: true,
        component: ToDoItem,
        handlers: {
            onKeyDown: (editor) => (e) => {
                if (e.key === 'Enter') {
                    const [entries] = getAboveNode(editor);
                    const textExist = entries.children.some(item => !!item.text);
                    if (!textExist) {
                        insertEmptyElement(editor, 'paragraph');
                    }
                }
            },
        },
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
            styles={ { root: { width: 'auto', cursor: 'pointer', padding: '0px' } } }
            type={ getPluginType(editor, KEY) }
            actionHandler='onMouseDown'
            icon={ <ToolbarButton
                onClick={ () => {} }
                icon={ ToDoIcon }
                isActive={ !!editor?.selection && block?.length && block[0].type === KEY }
            /> }
        />
    );
};
