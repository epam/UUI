import React from "react";
import { useEffect, useState } from "react";

/**
 * This HOC delays rendering of given React component which allow to skip rendering in Next.js SSR.
 * Basically, it excludes component from SSR and renders nothing on server side.
 */
export function withDeferRenderingForSsr<P = any>(Component: React.ComponentType<P>) {
    function WithDeferRenderingSafeForSsr(props: { compProps: P, forwardedRef: React.ForwardedRef<any> }) {
        const [shouldRender, setShouldRender] = useState(false);
        useEffect(() => { setShouldRender(true); }, []);
        if (shouldRender) {
            return <Component { ...props.compProps } ref={ props.forwardedRef } />;
        }
        return null;
    }

    return React.forwardRef<any, P>((props, ref) => {
        return <WithDeferRenderingSafeForSsr compProps={ props } forwardedRef={ ref } />;
    });
}
