import { PlateEditor, PlateElement, focusEditor, withProps } from '@udecode/plate-common';
import { ELEMENT_LI, ELEMENT_LIC, ELEMENT_OL, ELEMENT_UL, createListPlugin, getListItemEntry, toggleList } from '@udecode/plate-list';
import React, { Fragment } from 'react';

import { isPluginActive } from '../../helpers';
import { ReactComponent as UnorderedList } from '../../icons/bullet-list.svg';
import { ReactComponent as NumberedList } from '../../icons/numbered-list.svg';
import { ToolbarButton } from '../../implementation/ToolbarButton';
import { withOurList } from './withList';
import { ListElement } from './ListElement';

export const ELEMENT_UL_CUSTOM = 'unordered-list';
export const ELEMENT_OL_CUSTOM = 'ordered-list';
export const ELEMENT_LI_CUSTOM = 'list-item';
export const ELEMENT_LI_TEXT_CUSTOM = 'list-item-child';

export const listPlugin = () => createListPlugin({
    overrideByKey: {
        [ELEMENT_OL]: {
            type: ELEMENT_OL_CUSTOM,
            isElement: true,
            deserializeHtml: { rules: [{ validNodeName: 'OL' }] },
            component: ListElement,
            withOverrides: withOurList,
        },
        [ELEMENT_UL]: {
            type: ELEMENT_UL_CUSTOM,
            isElement: true,
            deserializeHtml: { rules: [{ validNodeName: 'UL' }] },
            component: ListElement,
            withOverrides: withOurList,
        },
        [ELEMENT_LI]: {
            type: ELEMENT_LI_CUSTOM,
            isElement: true,
            component: withProps(PlateElement, { as: 'li' }),
            deserializeHtml: { rules: [{ validNodeName: 'LI' }] },
        },
        [ELEMENT_LIC]: {
            type: ELEMENT_LI_TEXT_CUSTOM,
            isElement: true,
        },
    },
});

interface IToolbarButton {
    editor: PlateEditor;
}

export function ListButton({ editor }: IToolbarButton) {
    if (!isPluginActive(ELEMENT_OL) && !isPluginActive(ELEMENT_LI)) return null;

    const res = !!editor?.selection && getListItemEntry(editor);

    const isUnorderedActive = res?.list && res?.list[0]?.type === ELEMENT_UL_CUSTOM;
    const isOrderedActive = res?.list && res?.list[0]?.type === ELEMENT_OL_CUSTOM;

    const onListButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, type: string) => {
        e.preventDefault();
        e.stopPropagation();

        toggleList(editor, { type });
        focusEditor(editor);
    };

    return (
        <Fragment>
            <ToolbarButton
                onClick={ (e) => onListButtonClick(e, ELEMENT_OL_CUSTOM) }
                icon={ NumberedList }
                isActive={ !!editor?.selection && isOrderedActive }
            />
            <ToolbarButton
                onClick={ (e) => onListButtonClick(e, ELEMENT_UL_CUSTOM) }
                icon={ UnorderedList }
                isActive={ !!editor?.selection && isUnorderedActive }
            />
        </Fragment>
    );
}
