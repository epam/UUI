import {Editor, RenderBlockProps} from "slate-react";
import {Block, Editor as CoreEditor, KeyUtils} from "slate";
import { ToDoItem } from "./ToDoItem";
import * as React from "react";
import { List } from "immutable";
import * as checkboxListIcon from "../../icons/to-do.svg";
import { ToolbarButton } from '../../implementation/ToolbarButton';

export const toDoListPlugin = () => {
    const renderBlock = (props: RenderBlockProps, editor: CoreEditor, next: () => any) => {
        switch (props.node.type) {
            case 'toDoItem':
                return <ToDoItem { ...props } />;
            default:
                return next();
        }
    };

    const onKeyDown = (event: KeyboardEvent, editor: CoreEditor, next: () => any) => {
        const { value } = editor;

        if (event.key === 'Enter' && !event.shiftKey && value.startBlock.type === 'toDoItem') {
            return editor.splitBlock().setBlocks({ data: { checked: false }, type: 'toDoItem' });
        }

        if (event.key === 'Backspace' &&  value.selection.isCollapsed &&  value.startBlock.type === 'toDoItem' &&  value.selection.start.offset === 0) {
            return editor.setBlocks('paragraph');
        }

        if (new RegExp(/^\[]$/).test(value.anchorBlock.text)) {
            editor.moveToRangeOfNode(value.anchorBlock).delete();
            return addToDo(editor);
        }

        return next();
    };

    const addToDo = (editor: CoreEditor) => {
        const newToDoItem = Block.create({
            object: 'block',
            type: 'toDoItem',
            key: KeyUtils.create(),
            data: {
                checked: false,
            },
            nodes: List([{ text: '', object: 'text' } as any]),
        });

        editor.setBlocks(newToDoItem);
        // TODO: fix bug with focus
        // editor.focus();
    };

    return {
        renderBlock,
        onKeyDown,
        commands: {
            addToDo,
        },
        sidebarButtons: [ToDoItemToolbarButton],
    };
};

const isTodo = (editor: Editor) => {
    return editor.value.anchorBlock.type == 'toDoItem';
};


const ToDoItemToolbarButton = (props: { editor: Editor }) => {
    return <ToolbarButton isActive={ isTodo(props.editor) } icon={ checkboxListIcon } onClick={ () => isTodo(props.editor) ? props.editor.setBlocks('paragraph') : props.editor.setBlocks('toDoItem') } />;
};