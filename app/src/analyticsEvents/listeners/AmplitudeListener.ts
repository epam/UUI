import { IAnalyticsListener, AnalyticsEvent } from '@epam/uui-core';
import amplitude from 'amplitude-js';

export class AmplitudeListener implements IAnalyticsListener {
    public ampCode: string;
    public client: amplitude.AmplitudeClient;
    constructor(ampCode: string) {
        this.ampCode = ampCode;
        this.client = this.getAmplitudeClient();
    }

    private getAmplitudeClient(): amplitude.AmplitudeClient {
        const ampclient = amplitude.getInstance();
        ampclient.init(this.ampCode, undefined, { includeReferrer: true, includeUtm: true, saveParamsReferrerOncePerSession: false });
        return ampclient;
    }

    public sendEvent(event: AnalyticsEvent, parameters: Omit<AnalyticsEvent, 'name'>, eventType: string) {
        if (eventType !== 'event') return;
        this.client.logEvent(event.name, parameters);
    }
}
