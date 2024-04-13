import * as React from 'react';
import { CX, IHasCX } from '../types';
import { forwardRef } from './forwardRef';

type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;
type Overwrite<T, U> = DistributiveOmit<T, keyof U> & U;

export function withMods<TProps, TMods = {}>(
    Component: React.ComponentType<TProps>,
    getCx?: (props: Readonly<Overwrite<TProps, TMods>>) => CX,
    getProps?: (props: Readonly<Overwrite<TProps, TMods>>) => Partial<TProps>,
): React.ComponentType<Overwrite<TProps, TMods> & React.RefAttributes<any>> {
    const isClassComponent = Component.prototype instanceof React.Component;

    // Class components needs to be wrapped in any case,
    // as they might rely on withMods to add forwardedRef.
    if (!isClassComponent && !getProps && !getCx) {
        return Component as any;
    }

    function applyMods(props: Readonly<Overwrite<TProps, TMods>>) {
        // Most components are wrapped in withMods component.
        // Please keep this method simple and performant.
        // Don't clone objects/arrays if not needed.

        const modProps = getProps?.(props);
        const result: Readonly<Overwrite<TProps, TMods>> = Object.assign({}, props, modProps);

        const cx = getCx?.(props);

        if (cx) {
            (result as IHasCX).cx = [cx, (props as any).cx];
        }

        return result;
    }

    let wrappedComponent: React.ComponentType<Overwrite<TProps, TMods> & React.RefAttributes<any>>;

    if (!Component) {
        // Happens in tests, probably due to circular dependencies.
        return null;
    } else if (isClassComponent) {
        // Class component. Wrap with forwardRef, and pass ref in the forwardedRef prop
        wrappedComponent = forwardRef<any, Readonly<Overwrite<TProps, TMods>>>((props, ref) => {
            const allProps: any = applyMods(props);
            allProps.forwardedRef = ref;
            return React.createElement(Component, allProps);
        });
    } else if ((Component as any).render) {
        // React.forwardRef component.
        // Basically its object like { $$type: Symbol(FORWARD_REF), render: (props, ref) => ... }
        // However, $$type is not exposed, so there's no good way to detect this.
        // We re-wrap it in another forward ref, to avoid unnecessary stacking two forwardRefs
        wrappedComponent = forwardRef(
            (props: Readonly<Overwrite<TProps, TMods>>, ref: any) => (Component as any).render(applyMods(props), ref),
        );
    } else if (Component instanceof Function) {
        // Plain functional component. Just wrap with function, and apply mods to props
        wrappedComponent = (props: Overwrite<TProps, TMods>) => (Component as Function)(applyMods(props));
    } else {
        // Any other type of component. E.g. React.memo.
        // Wrap it in another functional component
        wrappedComponent = (props: Overwrite<TProps, TMods>) => React.createElement(Component, applyMods(props));
    }

    wrappedComponent.displayName = `${Component?.displayName || Component?.name || 'unknown'} (withMods)`;

    return wrappedComponent;
}
