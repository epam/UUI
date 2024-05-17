import {
    PlateEditor, PlateElementProps, focusEditor,
} from '@udecode/plate-common';
import {
    ELEMENT_LI, ELEMENT_LIC, ELEMENT_OL, ELEMENT_UL, createListPlugin, getListItemEntry, toggleList,
} from '@udecode/plate-list';
import React, { Fragment } from 'react';

import { useIsPluginActive } from '../../helpers';
import { ReactComponent as UnorderedList } from '../../icons/bullet-list.svg';
import { ReactComponent as NumberedList } from '../../icons/numbered-list.svg';
import { ToolbarButton } from '../../implementation/ToolbarButton';
import { ListElement } from './ListElement';
import {
    ELEMENT_OL_CUSTOM, ELEMENT_UL_CUSTOM, ELEMENT_LI_CUSTOM, ELEMENT_LI_TEXT_CUSTOM,
} from './constants';
import { WithToolbarButton } from '../../implementation/Toolbars';

export const listPlugin = () => createListPlugin<WithToolbarButton>({
    overrideByKey: {
        [ELEMENT_OL]: {
            type: ELEMENT_OL_CUSTOM,
            isElement: true,
            deserializeHtml: { rules: [{ validNodeName: 'OL' }] },
            component: ListElement,
        },
        [ELEMENT_UL]: {
            type: ELEMENT_UL_CUSTOM,
            isElement: true,
            deserializeHtml: { rules: [{ validNodeName: 'UL' }] },
            component: ListElement,
        },
        [ELEMENT_LI]: {
            type: ELEMENT_LI_CUSTOM,
            isElement: true,
            component: ({ children, attributes }: PlateElementProps) => {
                return <li { ...attributes }>{children}</li>;
            },
            deserializeHtml: { rules: [{ validNodeName: 'LI' }] },
        },
        [ELEMENT_LIC]: {
            type: ELEMENT_LI_TEXT_CUSTOM,
            isElement: true,
        },
    },
    options: {
        bottomBarButton: ListButton,
    },
});

interface IToolbarButton {
    editor: PlateEditor;
}

export function ListButton({ editor }: IToolbarButton) {
    if (!useIsPluginActive(ELEMENT_OL) && !useIsPluginActive(ELEMENT_LI)) return null;

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
