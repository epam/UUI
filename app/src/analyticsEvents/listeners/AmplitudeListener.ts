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
            cookieOptions: { domain: 'uui.epam.com' },
            autocapture: true,
        });

        return ampClient;
    }

    private hasConsent(): boolean {
        const dataLayer = (window as any).dataLayer ?? [];
        return dataLayer.length === 0 ? false : dataLayer.some((item: any) => item.event === 'OneTrustLoaded' && item.OnetrustActiveGroups?.includes('C0002'));
    }

    public sendEvent(event: AnalyticsEvent, parameters: Omit<AnalyticsEvent, 'name'>, eventType: string) {
        if (!this.hasConsent() || eventType !== 'event') return;
        this.client.track(event.name, parameters);
    }
}
