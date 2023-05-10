declare const __DEV__: boolean;

declare module '*.scss' {
    const all: { [selector: string]: string };
    export = all;
}

declare module '*.svg' {
    import React from 'react';

    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    const src: string;
    export default src;
}

declare module 'jsurl';
declare module 'query-string';
declare module 'draft-js-plugins-editor';
declare module 'draft-js-clear-formatting';
declare module 'draft-convert';
declare module 'draft-js-plugins-utils';
declare module 'draft-js/lib/*';
declare module 'slate-soft-break';
declare module 'slate-mark-hotkeys';
declare module 'markdown-draft-js';
