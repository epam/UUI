import React from "react";

import {
    ELEMENT_OL,
    ELEMENT_UL,
    ELEMENT_LI,
    createListPlugin,
    PlateEditor,
    ListToolbarButton,
    getPluginType,
    getListItemEntry,
    ELEMENT_LIC,
} from "@udecode/plate";
import { isPluginActive } from "../../../helpers";
import { ToolbarButton } from "../../implementation/ToolbarButton";
import { ReactComponent as UnorderedList } from "../../icons/bullet-list.svg";
import { ReactComponent as NumberedList } from "../../icons/numbered-list.svg";

const noop = () => {};

export const List = (props: any) => {
    const { attributes, children, element } = props;
    switch (element.type) {
        case ELEMENT_OL:
            return <ol { ...attributes } style={ { margin: '12px 0px' } }>{ children }</ol>;
        case ELEMENT_UL:
            return <ul { ...attributes } style={ { margin: '12px 0px' } }>{ children }</ul>;
        case ELEMENT_LI:
            return <li className={ element.type } { ...attributes }>{ children }</li>;
        case ELEMENT_LIC:
            return <div { ...attributes }>{ children }</div>;
        default:
            return <div { ...attributes }>{ children }</div>;
    }
};

export const listPlugin = () => createListPlugin();

interface IToolbarButton {
    editor: PlateEditor;
}

export const ListButton = ({ editor }: IToolbarButton) => {
    if (!isPluginActive(ELEMENT_OL) && !isPluginActive(ELEMENT_LI)) return null;

    const res = !!editor?.selection && getListItemEntry(editor);

    const isUnorderedActive = res?.list && res?.list[0]?.type === 'unordered-list';
    const isOrderedActive = res?.list && res?.list[0]?.type === 'ordered-list';

    return (
        <>
            <ListToolbarButton
                styles={ { root: {width: 'auto', cursor: 'pointer', padding: '0px' }} }
                type={ getPluginType(editor, ELEMENT_OL) }
                actionHandler='onMouseDown'
                icon={ <ToolbarButton
                    onClick={ noop }
                    icon={ NumberedList }
                    isActive={ !!editor?.selection && isOrderedActive }
                /> }
            />
            <ListToolbarButton
                styles={ { root: {width: 'auto', cursor: 'pointer', padding: '0px' }} }
                type={ getPluginType(editor, ELEMENT_UL) }
                actionHandler='onMouseDown'
                icon={ <ToolbarButton
                    onClick={ noop }
                    icon={ UnorderedList }
                    isActive={ !!editor?.selection && isUnorderedActive }
                /> }
            />
        </>
    );
};

