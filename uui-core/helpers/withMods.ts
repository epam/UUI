import * as React from 'react';
import { IHasCX, CX } from '../types';

export function withMods<TProps extends IHasCX, TMods = {}>(
    Component: React.ComponentType<TProps> | React.NamedExoticComponent<TProps>,
    getCx?: (props: Readonly<TProps & TMods>) => CX,
    getProps?: (props: Readonly<TProps & TMods>) => Partial<TProps>,
) {
    const wrappedComponent = React.forwardRef<any, TProps & TMods>((props, ref) => {
        // Most components are wrapped in withMods component.
        // Please keep this method simple, and performant
        // Don't clone objects/arrays if not needed

        let allProps: any = { ...props };

        if (getProps) {
            Object.assign(allProps, getProps?.(props));
        }

        allProps.cx = [getCx?.(props), props.cx];

        if (Component.prototype instanceof React.Component) {
            allProps.forwardedRef = ref;
        } else {
            allProps.ref = ref;
        }

        return React.createElement(Component, allProps);
    });

    wrappedComponent.displayName = `${Component?.displayName || Component?.name || 'unknown'} (withMods)`;

    return wrappedComponent;
}