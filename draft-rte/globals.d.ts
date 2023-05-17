/// <reference path="../uui_globals.d.ts" />

declare module '@epam/assets/scss/typography.scss' {
    // this is a hack, because draft-rte uses old version of @epam/assets
    const all: { [selector: string]: string };
    export = all;
}

// inherited definitions, required for module build
declare module "jsurl";
declare module "query-string";
declare module 'draft-js-plugins-editor';
declare module 'draft-convert';
declare module 'draft-js-clear-formatting';
declare module 'draft-js-plugins-utils';
declare module 'draft-js/lib/*';
declare module 'markdown-draft-js';
