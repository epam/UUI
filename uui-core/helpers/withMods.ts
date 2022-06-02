import * as React from 'react';
import { IHasCX, CX } from '../types';

export function withMods<TProps extends IHasCX, TMods = {}>(
    Component: React.ComponentType<TProps> | React.NamedExoticComponent<TProps>,
    getCx?: (props: Readonly<TProps & TMods>) => CX,
    getProps?: (props: Readonly<TProps & TMods>) => Partial<TProps>,
) {
    const wrappedComponent = React.forwardRef<any, TProps & TMods>((props, ref) => {
        const allProps: TProps & TMods = Object.assign({}, props, getProps?.(props));
        return React.createElement(Component, {
            ...allProps,
            cx: [getCx?.(props), props.cx],
            [Component.prototype instanceof React.Component ? 'forwardedRef' : 'ref']: ref
        });
    });

    wrappedComponent.displayName = `${Component?.displayName || Component?.name || 'unknown'} (withMods)`;

    return wrappedComponent;
}