/**
 * This file contains declarations which are common for "all" UUI modules.
 * Any declarations which aren't common for "all" modules should be added to
 * the respective module-level 'global.d.ts'
 */
declare let __DEV__: boolean;
declare let __PACKAGE_VERSION__: string;

/**
 * This is SCSS module.
 */
declare module '*.module.scss' {
    /**
     * '*.module.scss' is the only allowed file name pattern for scss modules.
     */
    const all: { [selector: string]: string };
    export = all;
}

/**
 * This is a not SCSS module (SCSS module should be named as "*.module.scss")
 */
declare module '*.scss' {
    /**
     * All scss modules must be named as "*.module.scss"
     * Any other ".scss" never export any selectors
     */
    const empty: never;
    export default empty;
}

declare module '*.svg' {
    // eslint-disable-next-line import/no-extraneous-dependencies
    import React from 'react';

    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    const src: string;
    export default src;
}
