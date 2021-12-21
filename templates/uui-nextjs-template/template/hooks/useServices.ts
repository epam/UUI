import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { NextRouterAdapter, useUuiServices, UuiContexts} from "@epam/uui";
import { skinContext } from "@epam/promo";
import { svc } from "../services";

export const useServices = () => {
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const uuiRouter = new NextRouterAdapter(router);

    const { services } = useUuiServices<any, UuiContexts>({
        router: uuiRouter,
        skinContext,
    });

    Object.assign(svc, services);

    useEffect(() => {
        const handleRouteChangeStart = () => {
            setIsLoading(true);
        };
        const handleRouteChangeComplete = () => {
            setIsLoading(false);
        };

        router.events.on('routeChangeError', handleRouteChangeComplete);
        router.events.on('routeChangeStart', handleRouteChangeStart);
        router.events.on('routeChangeComplete', handleRouteChangeComplete);

        // If the component is unmounted, unsubscribe
        // from the event with the `off` method:
        return () => {
            router.events.off('routeChangeStart', handleRouteChangeStart);
            router.events.off('routeChangeComplete', handleRouteChangeComplete);
            uuiRouter.unSubscribe();
        };
    }, []);

    return {
        services,
        isLoading,
    };
};