declare module '*.scss' {
    const all: { [selector: string]: string };
    export = all;
}

declare module '*.svg' {
    export const id: string;
    export const url: string;
    export const viewBox: string;
}

declare module "jsurl";
declare module "query-string";
