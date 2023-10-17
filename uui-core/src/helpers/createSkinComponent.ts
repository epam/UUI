import * as React from 'react';
import { CX } from '../types';

// export function createSkinComponent<TProps, TResult = {}>(
//     Component: any,
//     getCx?: (props: Readonly<TResult>) => CX,
//     getProps?: (props: Readonly<TResult>) => TResult,
// ) {
//     // const wrappedComponent = (props: TResult): React.ReactElement<TResult> => {
//     //     const allProps: any = { ...props };

//     //     if (getProps) {
//     //         Object.assign(allProps, getProps?.(props));
//     //     }

//     //     const getCxResult = getCx?.(props);

//     //     if (getCxResult) {
//     //         allProps.cx = [getCxResult, (props as any).cx];
//     //     }

//     //     return Component;
//     // };

//     // (wrappedComponent as any).displayName = `${Component?.displayName || Component?.name || 'unknown'} (createSkinComponent)`;

//     return Component as React.ComponentType<TResult> | React.NamedExoticComponent<TResult>;
// }

export function createSkinComponent<TProps, TResult = {}>(
    Component: React.ComponentType<TProps>,
    getCx?: (props: Readonly<TResult>) => CX,
    getProps?: (props: Readonly<TResult>) => TResult,
) {
    function SkinComponent(props: TResult): React.ReactElement<any> {
        const allProps: any = { ...props };

        if (getProps) {
            Object.assign(allProps, getProps(props));
        }

        const getCxResult = getCx?.(props);
        if (getCxResult) {
            allProps.cx = [getCxResult, (props as any).cx];
        }

        return React.createElement(Component, allProps);
    }

    SkinComponent.displayName = `${Component.displayName || Component.name || 'unknown'} (createSkinComponent)`;

    return SkinComponent;
}
