import React from 'react';
import {
    createLinkPlugin,
    someNode,
    LinkToolbarButton,
    ELEMENT_LINK,
    PlateEditor,
    Value,
    TElement,
    withLink,
    WithPlatePlugin,
    LinkPlugin,
    upsertLink,
    getPluginType,
    validateUrl,
} from "@udecode/plate";
import { useUuiContext } from '@epam/uui-core';

import { ToolbarButton } from '../../../implementation/ToolbarButton';

import { ReactComponent as LinkIcon } from "../../icons/link.svg";
import { AddLinkModal } from "./AddLinkModal";
import { isPluginActive } from '../../../helpers';
import { isUrl } from './isUrl';

export interface LinkElement extends TElement {
    href: string;
    type: string;
}

const LINK_ELEMENT = 'link';

export const linkPlugin = () => createLinkPlugin({
    type: LINK_ELEMENT,
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
