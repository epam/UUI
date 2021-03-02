declare module '*.scss' {
    var all: { [selector: string]: string };
    export = all;
}

declare module '*.svg' {
    export var id: string;
    export var url: string;
    export var viewBox: string;
}

declare module 'slate-soft-break';
declare module 'slate-mark-hotkeys';
declare module 'slate-uui-table-plugin';
declare module '@convertkit/slate-lists';
declare module '@mercuriya/slate-linkify';
declare module '@mercuriya/slate-gallery';
declare module 'slate-drop-or-paste-images';
declare module 'slate-html-serializer';
declare module 'get-video-id';
declare module 're-resizable';
declare module 'react-broadcast';

// inherited definitions, required for module build
declare module "jsurl";
declare module "query-string";
declare module 'draft-js-plugins-editor';
declare module 'draft-js-clear-formatting';
declare module 'draft-convert';
declare module 'draft-js-plugins-utils';
declare module 'draft-js/lib/*';
declare module 'slate-soft-break';
declare module 'slate-mark-hotkeys';
declare module 'markdown-draft-js';
declare module '@braintree/sanitize-url';
declare module 'htmlclean';
