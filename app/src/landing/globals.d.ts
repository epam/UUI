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

declare module 'parallax-js';
