import { IAnalyticsListener, AnalyticsEvent } from "@epam/uui";
import { AmplitudeClient } from "amplitude-js"

export class AmplitudeListener<TClient extends AmplitudeClient> implements IAnalyticsListener {

    public client: TClient;

    constructor(client: TClient) {
        this.client = client;
    }

    public sendEvent(event: AnalyticsEvent, parameters: Omit<AnalyticsEvent, "name">) {
        this.client.logEvent(event.name, parameters);
    }
}