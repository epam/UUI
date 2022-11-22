import {
    createPluginFactory,
    EText,
    getPluginType,
    isMarkActive,
    BlockToolbarButton,
    StyledLeafProps,
    TText,
    useEventPlateId,
    usePlateEditorRef,
    Value,
    focusEditor,
    setElements,
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

    const { element, editor, attributes, children } = props;
    const onChange = (value: boolean, ...rest: any): any => {
        console.log(rest);
        focusEditor(editor);
        setElements(editor, {
            ...element,
            data: { checked: value },
        });
    };
    console.log(props);
    return (
        <FlexRow rawProps={ attributes }>
            <div contentEditable={ false } className={ css.checkboxContainer }>
                <Checkbox value={ element.data.checked } onValueChange={ onChange }/>
            </div>
            <div className={ css.textContainer }>
                { children }
            </div>
        </FlexRow>
    );
}
//
export const ToDoList = <V extends Value = Value, N extends TText = EText<V>>(
    props: StyledLeafProps<V, N>,
) => {
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
