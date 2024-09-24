import {
    PlateEditor, PlateElementProps, focusEditor, PlatePlugin,
    KEY_DESERIALIZE_HTML,
    traverseHtmlElements,
    isHtmlBlockElement,
    postCleanHtml,
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
import { WithToolbarButton } from '../../implementation/Toolbars';
import { OL_TYPE, UL_TYPE, LI_TYPE, LI_CHILD_TYPE } from './constants';
import { cleanDocxListElementsToList } from '@udecode/plate-serializer-docx';

export const listPlugin = (): PlatePlugin => createListPlugin<WithToolbarButton>({
    overrideByKey: {
        [ELEMENT_OL]: {
            type: OL_TYPE,
            isElement: true,
            deserializeHtml: { rules: [{ validNodeName: 'OL' }] },
            component: ListElement,
        },
        [ELEMENT_UL]: {
            type: UL_TYPE,
            isElement: true,
            deserializeHtml: { rules: [{ validNodeName: 'UL' }] },
            component: ListElement,
        },
        [ELEMENT_LI]: {
            type: LI_TYPE,
            isElement: true,
            component: ({ children, attributes }: PlateElementProps) => {
                return <li { ...attributes }>{children}</li>;
            },
            deserializeHtml: { rules: [{ validNodeName: 'LI' }] },
        },
        [ELEMENT_LIC]: {
            type: LI_CHILD_TYPE,
            isElement: true,
        },
    },
    options: {
        bottomBarButton: ListButton,
    },
    inject: {
        pluginsByKey: {
            [KEY_DESERIALIZE_HTML]: {
                editor: {
                    insertData: {
                        transformData: (data) => {
                            const document = new DOMParser().parseFromString(
                                data,
                                'text/html',
                            );
                            const { body } = document;

                            cleanDocxListElementsToList(body);

                            traverseHtmlElements(body, (element) => {
                                if (element.tagName === 'LI') {
                                    const { childNodes } = element;

                                    // replace li block children (e.g. p) by their children
                                    const liChildren: Node[] = [];
                                    childNodes.forEach((child) => {
                                        if (isHtmlBlockElement(child as Element)) {
                                            liChildren.push(...child.childNodes);
                                        } else {
                                            liChildren.push(child);
                                        }
                                    });

                                    element.replaceChildren(...liChildren);

                                    // TODO: recursive check on ul parents for indent

                                    return false;
                                }
                                return true;
                            });

                            return postCleanHtml(body.innerHTML);
                        },
                    },
                },
            },
        },
    },
});

interface IToolbarButton {
    editor: PlateEditor;
}

export function ListButton({ editor }: IToolbarButton) {
    const isActiveOL = useIsPluginActive(ELEMENT_OL);
    const isActiveLI = useIsPluginActive(ELEMENT_LI);

    if (!isActiveOL && !isActiveLI) {
        return null;
    }

    // TODO: rewrite it
    const res = !!editor?.selection ? getListItemEntry(editor) : undefined;
    const isUnorderedActive = res?.list && res?.list[0]?.type === UL_TYPE;
    const isOrderedActive = res?.list && res?.list[0]?.type === OL_TYPE;

    const onListButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, type: string) => {
        e.preventDefault();
        e.stopPropagation();

        toggleList(editor, { type });
        focusEditor(editor);
    };

    return (
        <Fragment>
            <ToolbarButton
                onClick={ (e) => onListButtonClick(e, OL_TYPE) }
                icon={ NumberedList }
                isActive={ !!editor?.selection && isOrderedActive }
            />
            <ToolbarButton
                onClick={ (e) => onListButtonClick(e, UL_TYPE) }
                icon={ UnorderedList }
                isActive={ !!editor?.selection && isUnorderedActive }
            />
        </Fragment>
    );
}
