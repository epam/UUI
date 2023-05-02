import React from 'react';
import {
    getPluginType,
    createLinkPlugin,
    someNode,
    LinkToolbarButton,
    isEditorReadOnly,
    ELEMENT_LINK,
    PlateEditor
} from "@udecode/plate";
import { sanitizeUrl } from "@braintree/sanitize-url";

import { ToolbarButton } from '../../../implementation/ToolbarButton';

import { ReactComponent as LinkIcon } from "../../icons/link.svg";
import { AddLinkModal } from "./AddLinkModal";
import { useUuiContext } from '@epam/uui-core';
import { isPluginActive } from '../../../helpers';

import css from './link.scss';

export const linkPlugin = () => createLinkPlugin({
    type: 'link',
    props: ({ element, editor }) => ({
        className: css.link,
        style: { display: 'inline', textDecoration: 'underline' },
        ...(!isEditorReadOnly(editor) ? {} : {
            onClick: (e: Event) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(sanitizeUrl(`${ element.url }`), '_blank');
            }
        }),
    }),
});

interface ToolbarButton {
    editor: PlateEditor;
}

export const LinkButton = ({ editor }: ToolbarButton) => {
    const context = useUuiContext();

    const type = getPluginType(editor, ELEMENT_LINK);
    const isLink = !!editor?.selection && someNode(editor, { match: { type } });

    if (!isPluginActive(ELEMENT_LINK)) return null;

    return (
        <LinkToolbarButton
            styles={ { root: { width: 'auto', cursor: 'pointer', padding: '0px' } } }
            active={ isLink }
            onMouseDown={ async (event) => {
                if (!editor) return;

                event.preventDefault();
                context.uuiModals.show<string>((modalProps): any => (
                    <AddLinkModal
                        editor={ editor }
                        { ...modalProps }
                    />
                )).catch(() => null);
            } }
            icon={ <ToolbarButton
                onClick={ () => {} }
                icon={ LinkIcon }
                isActive={ !!editor?.selection && isLink }
            /> }
        />
    );
};
