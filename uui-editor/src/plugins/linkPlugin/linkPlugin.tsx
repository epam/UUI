import React from 'react';
import { useUuiContext } from '@epam/uui-core';

import { ToolbarButton } from '../../implementation/ToolbarButton';

import { PlateEditor, someNode } from '@udecode/plate-common';
import { ELEMENT_LINK, LinkPlugin, createLinkPlugin } from '@udecode/plate-link';
import { useIsPluginActive } from '../../helpers';
import { ReactComponent as LinkIcon } from '../../icons/link.svg';
import { AddLinkModal } from './AddLinkModal';
import { WithToolbarButton } from '../../implementation/Toolbars';

export const LINK_ELEMENT = 'link';

export const linkPlugin = () => createLinkPlugin<WithToolbarButton & LinkPlugin>({
    type: LINK_ELEMENT,
    overrideByKey: {
        [ELEMENT_LINK]: {
            component: (props) => (
                <a { ...props.attributes } style={ { display: 'inline' } } target="_blank" href={ props.element.url }>{ props.children }</a>
            ),
        },
    },
    options: {
        keepSelectedTextOnPaste: false,
        floatingBarButton: LinkButton,
    },
});

interface ToolbarLinkButtonProps {
    editor: PlateEditor;
}

export function LinkButton({ editor }: ToolbarLinkButtonProps) {
    const context = useUuiContext();

    if (!useIsPluginActive(ELEMENT_LINK)) return null;

    const isLink = !!editor?.selection && someNode(editor, { match: { type: LINK_ELEMENT } });

    return (
        <ToolbarButton
            onClick={ async (event) => {
                if (!editor) return;

                event.preventDefault();
                context.uuiModals.show<string>((modalProps): any => (
                    <AddLinkModal
                        editor={ editor }
                        { ...modalProps }
                    />
                )).catch(() => null);
            } }
            icon={ LinkIcon }
            isActive={ !!editor?.selection && isLink }
        />
    );
}
