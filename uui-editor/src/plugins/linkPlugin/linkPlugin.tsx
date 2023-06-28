export {};
// import { linkifyPlugin } from '@mercuriya/slate-linkify';
// import * as React from 'react';
// import css from './link.scss';
// import { Editor } from "slate";
// import { useUuiContext } from "@epam/uui-core";
// import { ReactComponent as LinkIcon } from "../../icons/link.svg";
// import {AddLinkModal} from "./AddLinkModal";
// import {ToolbarButton} from "../../implementation/ToolbarButton";
// import {sanitizeUrl} from "@braintree/sanitize-url";
//
// export const linkPlugin = () => {
//     const link = linkifyPlugin({
//         renderComponent: (args: any) => <a className={ css.link } { ...args } onClick={ (e) => e.ctrlKey && window.location.replace(sanitizeUrl(`${args.href}`)) }>{ args.children }</a>,
//     });
//
//     const hasLink = (editor: Editor) => {
//         const value: any = editor ? editor.value : { inlines: [] };
//         return value.inlines.some((i: any) => i.type === 'link');
//     };
//
//     return {
//         ...link,
//         renderInline: link.renderNode,
//         queries: {
//             hasLink,
//         },
//         toolbarButtons: [LinkButton],
//         serializers: [linkDesializer],
//     };
// };
//
// export const LinkButton = (props: { editor: any }) => {
//     const context = useUuiContext();
//     return <ToolbarButton isActive={ (props.editor as any).hasLink() } icon={ LinkIcon } onClick={ () => context.uuiModals.show<string>(modalProps => <AddLinkModal { ...modalProps } editor={ props.editor } />)
//         .catch(() => null) } />;
// };
//
// const linkDesializer = (el: any, next: any) => {
//     if (el.tagName.toLowerCase() === 'a') {
//         return {
//             object: 'inline',
//             type: 'link',
//             nodes: next(el.childNodes),
//             data: {
//                 url: el.getAttribute('href'),
//             },
//         };
//     }
// };
