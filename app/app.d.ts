declare module '*.scss' {
    const all: { [selector: string]: string };
    export = all;
}

declare module '*.svg' {
    export const id: string;
    export const url: string;
    export const viewBox: string;
}

declare module "tether-tooltip";
declare module "jsurl";
declare module "react-measure";
declare module "inline-style-transformer";
declare module 'draft-js-plugins-editor';
declare module 'draft-js-clear-formatting';
declare module 'draft-convert';
declare module 'draft-js-plugins-utils';
declare module 'draft-js/lib/*';
declare module 'prepend-http';
declare module 'slate-soft-break';
declare module 'slate-mark-hotkeys';
declare module '@convertkit/slate-lists';
declare module '@mercuriya/slate-linkify';
declare module '@mercuriya/slate-gallery';
declare module 'slate-drop-or-paste-images';
declare module 'slate-html-serializer';
declare module 'get-video-id';
declare module 'slate-uui-table-plugin';
declare module 'markdown-draft-js';
declare module 'react-breakpoints';
declare module 'react-broadcast';
declare module '@braintree/sanitize-url';
declare module 'htmlclean';

