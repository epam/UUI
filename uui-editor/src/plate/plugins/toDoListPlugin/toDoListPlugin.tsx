import React from 'react';

import {
    getPluginType,
    BlockToolbarButton,
    PlateEditor,
    getBlockAbove,
    createTodoListPlugin,
    ELEMENT_TODO_LI,
    getAboveNode,
    insertEmptyElement,
    deleteForward,
    deleteBackward,
} from '@udecode/plate';

import { ToolbarButton } from '../../implementation/ToolbarButton';
import { isPluginActive } from '../../../helpers';

import { ReactComponent as ToDoIcon } from '../../icons/to-do.svg';

import { ToDoItem } from './ToDoItem';
import { getBlockAboveByType } from '../../utils/getAboveBlock';
import { PARAGRAPH_TYPE } from '../paragraphPlugin/paragraphPlugin';

const TODO_ELEMENT_KEY = 'toDoItem';

export const toDoListPlugin = () => {
    // TODO: implement withOverrides for toggling between lists and todo lists
    return createTodoListPlugin({
        overrideByKey: {
            [ELEMENT_TODO_LI]: {
                type: TODO_ELEMENT_KEY,
                component: ToDoItem,
                handlers: {
                    onKeyDown: (editor) => (e) => {
                        if (!getBlockAboveByType(editor, [TODO_ELEMENT_KEY])) return;

                        if (e.key === 'Enter') {
                            const [entries] = getAboveNode(editor);
                            const textExist = entries.children.some(item => !!item.text);
                            if (!textExist) {
                                deleteForward(editor);
                                insertEmptyElement(editor, PARAGRAPH_TYPE);
                            }
                        }

                        // for smooth remove, replaces checkbox element with empty paragraph
                        if (e.key === 'Backspace') {
                            deleteBackward(editor);
                            insertEmptyElement(editor, PARAGRAPH_TYPE);
                            return true;
                        }
                    },
                },
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
            styles={ { root: { width: 'auto', height: 'auto', cursor: 'pointer', padding: '0px' } } }
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
