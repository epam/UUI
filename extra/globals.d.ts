declare module '*.scss' {
    var all: { [selector: string]: string };
    export = all;
}

declare module '*.svg' {
    export var id: string;
    export var url: string;
    export var viewBox: string;
}

declare module "jsurl";
declare module "query-string";
declare module 'draft-js-plugins-editor';
declare module 'draft-js-clear-formatting';
declare module 'draft-convert';
declare module 'draft-js-plugins-utils';
declare module 'draft-js/lib/*';
declare module 'markdown-draft-js';
