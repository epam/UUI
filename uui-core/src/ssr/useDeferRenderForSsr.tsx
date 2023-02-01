import { useContext, useEffect, useState } from "react";
import { UuiContext } from "../services";

/**
 * This hook is useful to delay render of something which could differ between server SSR and the client.
 */
export function useDeferRenderForSsr() {
    const { isNextJsApp } = useContext(UuiContext);
    const [isDeferred, setIsDeferred] = useState<boolean>(() => !!isNextJsApp);
    useEffect(() => { isNextJsApp && setIsDeferred(false); }, [isNextJsApp]);
    return { isDeferred };
}
