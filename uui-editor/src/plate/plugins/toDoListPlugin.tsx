// // import { Editor, RenderBlockProps } from "slate-react";
// // import { Block, Editor as CoreEditor, KeyUtils } from "slate";
// // import { ToDoItem } from "./ToDoItem";
// // import * as React from "react";
// // import { ReactComponent as CheckboxListIcon } from "../../icons/to-do.svg";
// // import { ToolbarButton } from "../../implementation/ToolbarButton";
// //
// // export const toDoListPlugin = () => {
// //     const renderBlock = (props: RenderBlockProps, editor: CoreEditor, next: () => any) => {
// //         switch (props.node.type) {
// //             case 'toDoItem':
// //                 return <ToDoItem { ...props } />;
// //             default:
// //                 return next();
// //         }
// //     };
// //
// //     const onKeyDown = (event: KeyboardEvent, editor: CoreEditor, next: () => any) => {
// //         const { value } = editor;
// //
// //         if (event.key === "Enter" && value.startBlock.type === "toDoItem" && editor.value.anchorBlock.text.length === 0) {
// //             return editor.setBlocks("paragraph");
// //         }
// //
// //         if (event.key === "Enter" && !event.shiftKey && value.startBlock.type === "toDoItem") {
// //             return editor.splitBlock().setBlocks({ data: { checked: false }, type: "toDoItem" });
// //         }
// //
// //         if (event.key === "Backspace" && value.selection.isCollapsed && value.startBlock.type === "toDoItem" && value.selection.start.offset === 0) {
// //             return editor.setBlocks("paragraph");
// //         }
// //
// //         if (new RegExp(/^\[]$/).test(value.anchorBlock.text)) {
// //             editor.moveToRangeOfNode(value.anchorBlock).delete();
// //             return addToDo(editor);
// //         }
// //
// //         return next();
// //     };
// //
// //     return {
// //         renderBlock,
// //         onKeyDown,
// //         commands: {
// //             addToDo,
// //         },
// //         sidebarButtons: [ToDoItemToolbarButton],
// //     };
// // };
// //
// // const addToDo = (editor: Editor | CoreEditor) => {
// //     const newToDoItem = Block.create({
// //         object: "block",
// //         type: "toDoItem",
// //         key: KeyUtils.create(),
// //         data: {
// //             checked: false,
// //         },
// //         nodes: [{ text: "", object: "text" }],
// //     });
// //
// //     editor.setBlocks(newToDoItem);
// //     // TODO: fix bug with focus
// //     // editor.focus();
// // };
// //
// // const isTodo = (editor: Editor) => {
// //     return editor.value.anchorBlock.type == "toDoItem";
// // };
// //
// //
// // const ToDoItemToolbarButton = (props: { editor: Editor }) => {
// //     const onClick = () => {
// //         if (props.editor.value.anchorBlock.type === "list-item-child") {
// //             const listType = (props.editor as any).isList("ordered-list")
// //                 ? "ordered-list"
// //                 : "unordered-list";
// //             (props.editor as any).toggleList({ type: listType });
// //
// //             addToDo(props.editor);
// //             return;
// //         }
// //
// //         isTodo(props.editor)
// //             ? props.editor.setBlocks("paragraph")
// //             : addToDo(props.editor);
// //     };
// //     return <ToolbarButton isActive={ isTodo(props.editor) } icon={ CheckboxListIcon } onClick={ onClick }/>;
// // };
//
import {
    createPluginFactory,
    EText,
    getPluginType, isMarkActive,
    ToolbarButton,
    BlockToolbarButton,
    insertElements,
    StyledLeafProps,
    TText, useEventPlateId, usePlateEditorRef,
    Value
} from "@udecode/plate";
import React from "react";
//
import { uuiSkin } from '@epam/uui-core';
import * as css from '../../plugins/toDoListPlugin/ToDoItem.scss';
import { ToolbarButton as UUIToolbarButton } from "../../implementation/ToolbarButton";
import { ReactComponent as ToDoIcon } from "../icons/to-do.svg";
import { isPluginActive } from "../../helpers";
//
const { Checkbox, FlexRow } = uuiSkin;
//
export function ToDoItem(props: any): any {

    const onChange = (value: boolean) => {
        const { editor, node } = props;
        editor.setNodeByKey(node.key, {
            data: { checked: value },
            type: 'toDoItem',
        });
    }

    return (
        <FlexRow rawProps={ props.attributes }>
            <div contentEditable={ false } className={ css.checkboxContainer }>
                <Checkbox value={ false } onValueChange={ onChange }/>
            </div>
            <div className={ css.textContainer }>
                { props.children }
            </div>
        </FlexRow>
    );
}
//
export const ToDoList = <V extends Value = Value, N extends TText = EText<V>>(
    props: StyledLeafProps<V, N>,
) => {
    const { attributes, children } = props;

    return (
        <ToDoItem { ...props } />
    );
};
//
export const createToDoListPlugin = createPluginFactory({
    key: 'toDoItem',
    isElement: true,
    component: ToDoList,
});
//
export const ToDoListToolbarButton = ({ id }: any) => {
    const editor = usePlateEditorRef(useEventPlateId(id));

    if (!isPluginActive('toDoItem')) return null;

    return (
        <BlockToolbarButton
            styles={ { root: {width: 'auto', cursor: 'pointer' }} }
            type={ getPluginType(editor, 'toDoItem') }
            icon={ <UUIToolbarButton
                onClick={ () => {} }
                icon={ ToDoIcon }
                isActive={ !!editor?.selection && isMarkActive(editor, 'uui-richTextEditor-bold'!) }
            /> }
        />
    );
};
