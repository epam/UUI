import { linkifyPlugin } from '@mercuriya/slate-linkify';
import * as React from 'react';
import * as css from './link.scss';
import { Editor } from "slate";
import {UuiContexts, uuiContextTypes} from "@epam/uui";
import * as linkIcon from "../../icons/link.svg";
import {AddLinkModal} from "./AddLinkModal";
import {ToolbarButton} from "../../implementation/ToolbarButton";
import {sanitizeUrl} from "@braintree/sanitize-url";

export const linkPlugin = () => {
    const link = linkifyPlugin({
        renderComponent: (args: any) => <a className={ css.link } { ...args } onClick={ (e) => e.ctrlKey && window.location.replace(sanitizeUrl(`${args.href}`)) }>{ args.children }</a>,
    });

    const hasLink = (editor: Editor) => {
        const value: any = editor ? editor.value : { inlines: [] };
        return value.inlines.some((i: any) => i.type === 'link');
    };

    return {
        ...link,
        renderInline: link.renderNode,
        queries: {
            hasLink,
        },
        toolbarButtons: [LinkButton],
        serializers: [linkDesializer],
    };
};

export const LinkButton = (props: { editor: any }, context: UuiContexts) => {
    return <ToolbarButton isActive={ (props.editor as any).hasLink() } icon={ linkIcon } onClick={ () => context.uuiModals.show<string>(modalProps => <AddLinkModal { ...modalProps } editor={ props.editor } />) } />;
};
LinkButton.contextTypes = uuiContextTypes;

const linkDesializer = (el: any, next: any) => {
    if (el.tagName.toLowerCase() === 'a') {
        return {
            object: 'inline',
            type: 'link',
            nodes: next(el.childNodes),
            data: {
                url: el.getAttribute('href'),
            },
        };
    }
};