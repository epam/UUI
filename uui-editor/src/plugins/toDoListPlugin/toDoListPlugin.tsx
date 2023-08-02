import React from 'react';

import { isPluginActive } from '../../helpers';
import { ToolbarButton } from '../../implementation/ToolbarButton';

import { ReactComponent as ToDoIcon } from '../../icons/to-do.svg';

import { PlateEditor, deleteBackward, deleteForward, focusEditor, getAboveNode, getBlockAbove, insertEmptyElement, toggleNodeType } from '@udecode/plate-common';
import { ELEMENT_TODO_LI, createTodoListPlugin } from '@udecode/plate-list';
import { getBlockAboveByType } from '../../utils/getAboveBlock';
import { PARAGRAPH_TYPE } from '../paragraphPlugin/paragraphPlugin';
import { ToDoItem } from './ToDoItem';

const TODO_ELEMENT_KEY = 'toDoItem';

export const toDoListPlugin = () => {
    // TODO: implement withOverrides for toggling between lists and todo lists
    return createTodoListPlugin({
        overrideByKey: {
            [ELEMENT_TODO_LI]: {
                key: TODO_ELEMENT_KEY,
                type: TODO_ELEMENT_KEY,
                component: ToDoItem,
                handlers: {
                    onKeyDown: (editor) => (e) => {
                        if (!getBlockAboveByType(editor, [TODO_ELEMENT_KEY])) return;

                        if (e.key === 'Enter') {
                            const [entries] = getAboveNode(editor);
                            const textExist = entries.children.some((item) => !!item.text);
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
            },
        },
    });
};

interface IToolbarButton {
    editor: PlateEditor;
}

export function ToDoListButton({ editor }: IToolbarButton) {
    if (!isPluginActive(TODO_ELEMENT_KEY)) return null;

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
