import * as React from 'react';
import { CX } from '../types';
import { forwardRef } from './forwardRef';

export function withMods<TProps, TMods = {}>(
    Component: React.ComponentType<TProps> | React.NamedExoticComponent<TProps>,
    getCx?: (props: Readonly<TProps & TMods>) => CX,
    getProps?: (props: Readonly<TProps & TMods>) => Partial<TProps>,
) {
    return /* @__PURE__ */_withMods<TProps, TMods>(Component, getCx, getProps);
}

function _withMods<TProps, TMods = {}>(
    Component: React.ComponentType<TProps> | React.NamedExoticComponent<TProps>,
    getCx?: (props: Readonly<TProps & TMods>) => CX,
    getProps?: (props: Readonly<TProps & TMods>) => Partial<TProps>,
) {
    const wrappedComponent = /* @__PURE__ */forwardRef<any, TProps & TMods>((props, ref) => {
        // Most components are wrapped in withMods component.
        // Please keep this method simple, and performant
        // Don't clone objects/arrays if not needed

        const allProps: any = { ...props };

        if (getProps) {
            Object.assign(allProps, getProps?.(props));
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

    (wrappedComponent as any).displayName = `${Component?.displayName || Component?.name || 'unknown'} (withMods)`;

    return wrappedComponent;
}
