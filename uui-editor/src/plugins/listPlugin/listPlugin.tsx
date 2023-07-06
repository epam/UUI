import React from "react";


import { isPluginActive } from "../../helpers";
import { ToolbarButton } from "../../implementation/ToolbarButton";
import { ReactComponent as UnorderedList } from "../../icons/bullet-list.svg";
import { ReactComponent as NumberedList } from "../../icons/numbered-list.svg";
import { PlateEditor, getPluginType } from "@udecode/plate-common";
import { createListPlugin, ELEMENT_OL, ELEMENT_UL, ELEMENT_LI, ELEMENT_LIC, getListItemEntry } from "@udecode/plate-list";
import { ListToolbarButton } from "@udecode/plate-ui";

const noop = () => {};

export const ELEMENT_UL_CUSTOM = 'unordered-list';
export const ELEMENT_OL_CUSTOM = 'ordered-list';
export const ELEMENT_LI_CUSTOM = 'list-item';
export const ELEMENT_LI_TEXT_CUSTOM = 'list-item-child';

export const List = (props: any) => {
    const { attributes, children, element } = props;
    switch (element.type) {
        case ELEMENT_OL_CUSTOM:
            return <ol { ...attributes }>{ children }</ol>;
        case ELEMENT_UL_CUSTOM:
            return <ul { ...attributes }>{ children }</ul>;
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
        },
        [ELEMENT_LI]: {
            type: ELEMENT_LI_CUSTOM,
            isElement: true,
            component: List,
            deserializeHtml: { rules: [{ validNodeName: 'LI' }] },
        },
        [ELEMENT_LIC]: {
            type: ELEMENT_LI_TEXT_CUSTOM,
            isElement: true,
            component: List,
        },
    },
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
                styles={ { root: { width: 'auto', height: 'auto', cursor: 'pointer', padding: '0px', } } }
                type={ getPluginType(editor, ELEMENT_OL) }
                actionHandler='onMouseDown'
                icon={ <ToolbarButton
                    onClick={ noop }
                    icon={ NumberedList }
                    isActive={ !!editor?.selection && isOrderedActive }
                /> }
            />
            <ListToolbarButton
                styles={ { root: { width: 'auto', height: 'auto', cursor: 'pointer', padding: '0px' } } }
                type={ getPluginType(editor, ELEMENT_UL) }
                actionHandler='onMouseDown'
                icon={ <ToolbarButton
                    // styles={ { root: {  } } }
                    onClick={ noop }
                    icon={ UnorderedList }
                    isActive={ !!editor?.selection && isUnorderedActive }
                /> }
            />
        </>
    );
};

