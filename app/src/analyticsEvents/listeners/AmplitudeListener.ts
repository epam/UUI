import { IAnalyticsListener, AnalyticsEvent } from '@epam/uui-core';
import * as amplitude from '@amplitude/analytics-browser';
import { BrowserClient } from '@amplitude/analytics-core';

export class AmplitudeListener implements IAnalyticsListener {
    public ampCode: string;
    public client: BrowserClient;
    constructor(ampCode: string) {
        this.ampCode = ampCode;
        this.client = this.getAmplitudeClient();
    }

    private getAmplitudeClient(): BrowserClient {
        const ampClient = amplitude.createInstance();

        ampClient.init(this.ampCode, undefined, {
            // includeReferrer: true,
            // includeUtm: true,
            // saveParamsReferrerOncePerSession: false,
            cookieOptions: { domain: 'uui.epam.com' },
        });

        return ampClient;
    }

    public sendEvent(event: AnalyticsEvent, parameters: Omit<AnalyticsEvent, 'name'>, eventType: string) {
        if (eventType !== 'event') return;
        this.client.track(event.name, parameters);
    }
}
