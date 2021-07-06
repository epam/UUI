import * as React from "react";
import {useCallback} from "react";
import {ContextProvider} from "@epam/uui";
import { svc } from "../../../services";
import { AmplitudeClient, getInstance} from "amplitude-js";
import { IAnalyticsListener, AnalyticsEvent } from "@epam/uui";

/**An example of creation AmplitudeClientListener */
class AmplitudeListener<TClient extends AmplitudeClient> implements IAnalyticsListener {
    public client: TClient;
    public name?: string;

    constructor(client: TClient, name: string) {
        this.client = client;
        this.name = name;
    }

    public sendEvent(event: AnalyticsEvent, parameters: Omit<AnalyticsEvent, "name">) {
        this.client.logEvent(event.name, parameters);
    }
}



export const AnalyticsContextBase: React.FC = () => {
    const loadAppContext = useCallback((api: any) => Promise.resolve(), []);

    const onInitCompleted = useCallback((context) => {
        Object.assign(svc, context);

        /**Here you can create AmplitudeClient and add it to the listener*/
        const ampClient = getAmpClient("Your amplitude secret key");
        const listener = new AmplitudeListener<AmplitudeClient>(ampClient, "Your client name");
        context.uuiAnalytics.addListener(listener);
    }, []);

    /**An example of creation AmplitudeClient*/
    const getAmpClient = useCallback((ampCode: string) =>  {
        const ampclient = getInstance();
        ampclient.init(ampCode, undefined, {includeReferrer: true, includeUtm: true, saveParamsReferrerOncePerSession: false});
        return ampclient;
    }, [])

    return (
        <ContextProvider loadAppContext={ loadAppContext }
                         onInitCompleted={ onInitCompleted }
                         gaCode='Your google analytics secret key'
        >
            Your app component
        </ContextProvider>
    );
};