import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import { NextRouterAdapter, useUuiServices, UuiContexts, GAListener} from "@epam/uui-core";
import {getApi, TApi} from "../helpers/apiDefinition";
import {skinContext} from "@epam/promo";
import {svc} from "../helpers/services";
import {AmplitudeListener} from "../helpers/ampListener";

const AMPLITUDE_KEY = 'b2260a6d42a038e9f9e3863f67042cc1';

export const useServices = ({ appData }: { appData: any }) => {
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const uuiRouter = new NextRouterAdapter(router);

    const { services } = useUuiServices<TApi, UuiContexts>({
        apiDefinition: getApi,
        appContext: appData,
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

        const ampClient =  new AmplitudeListener(AMPLITUDE_KEY);
        const gaClient = new GAListener('UA-132675234-1');
        svc.uuiAnalytics.addListener(ampClient);
        svc.uuiAnalytics.addListener(gaClient);

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