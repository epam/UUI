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
} from "@udecode/plate";
import { isPluginActive } from "../../../helpers";
import { ToolbarButton } from "../../implementation/ToolbarButton";
import { ReactComponent as UnorderedList } from "../../icons/bullet-list.svg";
import { ReactComponent as NumberedList } from "../../icons/numbered-list.svg";
import { withOurList } from "./withList";

const noop = () => {};

export const ELEMENT_UL_CUSTOM = 'unordered-list';
export const ELEMENT_OL_CUSTOM = 'ordered-list';
export const ELEMENT_LI_CUSTOM = 'list-item';
export const ELEMENT_LI_TEXT_CUSTOM = 'list-item-child';

export const List = (props: any) => {
    const { attributes, children, element } = props;
    switch (element.type) {
        case ELEMENT_OL_CUSTOM:
            return <ol { ...attributes } style={ { margin: '12px 0px' } }>{ children }</ol>;
        case ELEMENT_UL_CUSTOM:
            return <ul { ...attributes } style={ { margin: '12px 0px' } }>{ children }</ul>;
        case ELEMENT_LI_CUSTOM:
            return <li className={ element.type } { ...attributes }>{ children }</li>;
        case ELEMENT_LI_TEXT_CUSTOM:
            return <div { ...attributes }>{ children }</div>;
        default:
            return <div { ...attributes }>{ children }</div>;
    }
};


export const listPlugin = () => createListPlugin({
    overrideByKey: {
        [ELEMENT_OL]: {
            type: ELEMENT_OL_CUSTOM,
            isElement: true,
            deserializeHtml: { rules: [{ validNodeName: 'OL' }] },
            component: List,
        },
        [ELEMENT_UL]: {
            type: ELEMENT_UL_CUSTOM,
            isElement: true,
            deserializeHtml: { rules: [{ validNodeName: 'UL' }] },
            component: List,
            // TODO: move to plate
            withOverrides: withOurList,
        },
        [ELEMENT_LI]: {
            type: ELEMENT_LI_CUSTOM,
            isElement: true,
            component: List,
        },
    },
    plugins: [
        {
            key: ELEMENT_LI_TEXT_CUSTOM,
            type: ELEMENT_LI_TEXT_CUSTOM,
            isElement: true,
            component: List,
        },
    ],
});

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
                styles={ { root: { width: 'auto', cursor: 'pointer', padding: '0px' } } }
                type={ getPluginType(editor, ELEMENT_OL) }
                actionHandler='onMouseDown'
                icon={ <ToolbarButton
                    onClick={ noop }
                    icon={ NumberedList }
                    isActive={ !!editor?.selection && isOrderedActive }
                /> }
            />
            <ListToolbarButton
                styles={ { root: { width: 'auto', cursor: 'pointer', padding: '0px' } } }
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

