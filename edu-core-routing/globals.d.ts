declare module '*.svg' {
    import React from 'react';
    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    const src: string;
    export default src;
}

declare module "tether-tooltip";
declare module "jsurl";
declare module "query-string";
declare module "inline-style-transformer";