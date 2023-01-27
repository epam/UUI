import { useEffect, useState } from "react";

/**
 * This hook is useful to delay render of something which could differ between server SSR and the client.
 */
export function useDeferRenderForSsr() {
    const [shouldRender, setShouldRender] = useState(false);
    useEffect(() => { setShouldRender(true); }, []);
    return { shouldRender };
}
