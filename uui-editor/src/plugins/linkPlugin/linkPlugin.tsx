import React from 'react';

import { useUuiContext } from '@epam/uui-core';

import { ToolbarButton } from '../../implementation/ToolbarButton';

import { ReactComponent as LinkIcon } from "../../icons/link.svg";
import { AddLinkModal } from "./AddLinkModal";
import { isPluginActive } from '../../helpers';
import { isUrl } from './isUrl';
import { TElement, Value, someNode, PlateEditor, WithPlatePlugin } from '@udecode/plate-common';
import { LinkPlugin, withLink, validateUrl, upsertLink, createLinkPlugin, ELEMENT_LINK } from '@udecode/plate-link';
import { LinkToolbarButton } from '@udecode/plate-ui';

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

const LINK_ELEMENT = 'link';

export const linkPlugin = () => createLinkPlugin({
    type: LINK_ELEMENT,
    withOverrides: withOurLink,
    then: () => ({ options: { isUrl, } }),
    overrideByKey: {
        [ELEMENT_LINK]: {
            component: (props) => (
                <a { ...props.attributes } style={ { display: 'inline' } } target='_blank' href={ props.element.url }>{ props.children }</a>
            ),
        }
    },
});

interface ToolbarLinkButtonProps {
    editor: PlateEditor;
}

export const LinkButton = ({ editor }: ToolbarLinkButtonProps) => {
    const context = useUuiContext();

    if (!isPluginActive(ELEMENT_LINK)) return null;

    const isLink = !!editor?.selection && someNode(editor, { match: { type: LINK_ELEMENT } });

    return (
        <LinkToolbarButton
            styles={ { root: { width: 'auto', height: 'auto', cursor: 'pointer', padding: '0px' } } }
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
