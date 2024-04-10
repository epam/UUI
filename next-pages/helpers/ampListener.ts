import { IAnalyticsListener, AnalyticsEvent } from "@epam/uui-core";
import amplitude from "amplitude-js";

export class AmplitudeListener implements IAnalyticsListener {
    public ampCode: string;
    public client: amplitude.AmplitudeClient;

    constructor(ampCode: string) {
        this.ampCode = ampCode;
        this.client = this.getAmplitudeClient();
    }

    private getAmplitudeClient(): amplitude.AmplitudeClient {
        const ampClient = amplitude.getInstance();
        ampClient.init(this.ampCode, undefined, {includeReferrer: true, includeUtm: true, saveParamsReferrerOncePerSession: false});
        return ampClient;
    }

    public sendEvent(event: NonNullable<AnalyticsEvent>, parameters: Omit<AnalyticsEvent, "name">, eventType?: string) {
        if (eventType !== "event") return;
        this.client.logEvent(event.name, parameters);
    }
}