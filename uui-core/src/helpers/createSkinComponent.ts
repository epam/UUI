import * as React from 'react';
import { CX } from '../types';

export function createSkinComponent<TProps, TResult = {}>(
    Component: React.ComponentType<TProps>,
    getProps?: (props: Readonly<TResult>) => TResult,
    getCx?: (props: Readonly<TResult>) => CX,
) : (props: TResult & React.RefAttributes<TResult>) => React.ReactElement | null {
    if (!getProps && !getCx) {
        return Component as any;
    }

    const SkinComponent = React.forwardRef<any, any>((props: TResult, ref): React.ReactElement<any> | null => {
        const allProps: any = { ...props };

        if (getProps) {
            Object.assign(allProps, getProps(props));
        }

        const getCxResult = getCx?.(props);
        if (getCxResult) {
            allProps.cx = [getCxResult, (props as any).cx];
        }

        if (Component.prototype instanceof React.Component) {
            allProps.forwardedRef = ref;
        } else {
            allProps.ref = ref;
        }

        return React.createElement(Component, allProps);
    });

    SkinComponent.displayName = `${Component.displayName || Component.name || 'unknown'} (createSkinComponent)`;

    return SkinComponent;
}
