import React, { useCallback } from 'react';
import { ContextProvider } from '@epam/uui-core';
import { svc } from '../../../services';
import { IAnalyticsListener, AnalyticsEvent } from '@epam/uui-core';
import * as amplitude from '@amplitude/analytics-browser';
import { BrowserClient } from '@amplitude/analytics-core';

/** An example of creation AmplitudeClientListener */
export class AmplitudeListener implements IAnalyticsListener {
    public ampCode: string;
    public client: BrowserClient;
    constructor(ampCode: string) {
        this.ampCode = ampCode;
        this.client = this.getAmplitudeClient();
    }

    private getAmplitudeClient(): BrowserClient {
        const ampClient = amplitude.createInstance();

        ampClient.init(this.ampCode, undefined);

        return ampClient;
    }

    public sendEvent(event: AnalyticsEvent, parameters: Omit<AnalyticsEvent, 'name'>, eventType: string) {
        if (eventType !== 'event') return;
        this.client.track(event.name, parameters);
    }
}

const AnalyticsContextBase: React.FC = () => {
    const loadAppContext = useCallback(() => Promise.resolve(), []);

    const onInitCompleted = useCallback((context: any) => {
        Object.assign(svc, context);

        /** Here you can create AmplitudeClient and add it to the listener */
        const listener = new AmplitudeListener('Your amplitude secret key');
        context.uuiAnalytics.addListener(listener);
    }, []);

    return (
        <ContextProvider loadAppContext={ loadAppContext } onInitCompleted={ onInitCompleted } gaCode="Your google analytics secret key">
            Your app component
        </ContextProvider>
    );
};

export default AnalyticsContextBase;
