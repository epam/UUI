declare module '*.less' {
    var all: { [selector: string]: string };
    export = all;
}

declare module '*.scss' {
    var all: { [selector: string]: string };
    export = all;
}

declare module '*.svg' {
    export var id: string;
    export var url: string;
    export var viewBox: string;
}