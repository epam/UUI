import * as React from 'react';
import { CX } from '../types';

export function createSkinComponent<SourceProps, SkinProps = {}>(
    Component: React.ComponentType<SourceProps>,
    getProps?: (props: Readonly<SkinProps>) => Partial<SkinProps | SourceProps>,
    getCx?: (props: Readonly<SkinProps>) => CX,
) : (props: SkinProps & React.RefAttributes<any>) => React.ReactElement | null {
    if (!getProps && !getCx) {
        return Component as any;
    }

    const SkinComponent = /* @__PURE__ */React.forwardRef<any, any>((props: SkinProps, ref): React.ReactElement<any> | null => {
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
