import * as React from 'react';
import { CX, IHasCX } from '../types';

export function withMods<TSource, TResult>(
    Component: React.ComponentType<TSource>,
    getCx?: (props: Readonly<TResult>) => CX,
    getProps?: (props: TResult) => Partial<TSource>,
): React.ComponentType<TResult & React.RefAttributes<any>> {
    const isClassComponent = Component.prototype instanceof React.Component;

    // Class components needs to be wrapped in any case,
    // as they might rely on withMods to add forwardedRef.
    if (!isClassComponent && !getProps && !getCx) {
        return Component as any;
    }

    function applyMods(props: Readonly<TResult>) {
        // Most components are wrapped in withMods component.
        // Please keep this method simple and performant.
        // Don't clone objects/arrays if not needed.

        const modProps = getProps?.(props);
        const result: Readonly<TResult> = Object.assign({}, props, modProps);

        const cx = getCx?.(props);

        if (cx) {
            (result as IHasCX).cx = [cx, (props as any).cx];
        }

        return result;
    }

    if (!Component) {
        // Happens in tests, probably due to circular dependencies.
        return null;
    } else if (Component instanceof Function && !isClassComponent) {
        // Plain functional component. Just wrap with function, and apply mods to props
        const wrapped = (props: TResult) => (Component as Function)(applyMods(props));
        wrapped.displayName = Component.name;
        return wrapped;
    } else {
        // Any other type of component. E.g. React.memo. or class component
        // Wrap it in another functional component
        return function (props: TResult) {
            const resultProps: any = applyMods(props);
            if (isClassComponent) {
                resultProps.forwardedRef = (props as any).ref;
            }
            return React.createElement(Component, resultProps);
        };
    }
}
