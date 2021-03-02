import * as React from 'react';
import { IHasCX, CX } from '../types';

export function withMods<TProps extends IHasCX, TMods = {}>(
    component: React.ComponentClass<TProps> | React.FC<TProps>,
    getCx: (props: Readonly<TProps & TMods>) => CX,
    getProps?: (props: Readonly<TProps & TMods>) => Partial<TProps>,
): React.ComponentClass<TProps & TMods> {
    const wrappedComponent: React.RefForwardingComponent<any, TProps & TMods> = (outerProps, ref) => {
        const cx = [getCx(outerProps), outerProps.cx];
        const innerProps = getProps && getProps(outerProps);

        // Spread operator is faster than Object.assign. However, with ES5 target, is transpiled to a slower TypeScript helpers.
        // We can revisit that when we'll target ES7 with native spread operator.
        // tslint:disable-next-line
        const props: any = Object.assign({}, outerProps, innerProps);
        props.cx = cx;
        props.ref = ref;
        //const props = { ...outerProps as any, ...innerProps as any, cx, ref }; // spread version

        return React.createElement(component, props);
    };

    (wrappedComponent as any).displayName = `withMods(${component?.displayName || component?.name || 'unknown'})`;

    return React.forwardRef(wrappedComponent) as any;
}