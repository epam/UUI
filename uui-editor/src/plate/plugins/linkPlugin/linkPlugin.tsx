import React from 'react';
import {
    getPluginType,
    createLinkPlugin,
    someNode,
    LinkToolbarButton,
    ELEMENT_LINK,
    PlateEditor,
    validateUrl,
    Value,
    TElement,
    withLink,
    WithPlatePlugin,
    LinkPlugin,
    upsertLink,
} from "@udecode/plate";
import { useUuiContext } from '@epam/uui-core';

import { ToolbarButton } from '../../../implementation/ToolbarButton';

import { ReactComponent as LinkIcon } from "../../icons/link.svg";
import { AddLinkModal } from "./AddLinkModal";
import { isPluginActive } from '../../../helpers';


export interface LinkElement extends TElement {
    href: string;
    type: string;
}

const withOurLink = <
    V extends Value = Value,
    E extends PlateEditor<V> = PlateEditor<V>
>(
    editor: E,
    options: WithPlatePlugin<LinkPlugin, V, E>
) => {
    const { insertData } = editor;

    editor = withLink(editor, options);

    editor.insertData = (data: DataTransfer) => {
        const text = data.getData('text/plain');
        const textHref = options.options.getUrlHref?.(text);

        // validation is important here. if missed, leads to bugs with insertData plugin
        // TODO: create issue to have it inside plate ui (pasting links within highlighted text should replace text with pasted url)
        if (text && validateUrl(editor, text)) {
            const inserted = upsertLink(editor, {
                text: textHref || text,
                url: textHref || text,
                target: '_blank',
                insertTextInLink: true,
            });
            if (inserted) return;
        }

        insertData(data);
    }
    return editor;
}

export const linkPlugin = () => createLinkPlugin({
    type: 'link',
    withOverrides: withOurLink,
    then: () => ({
        props: () => ({
            style: { display: 'inline' },
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
