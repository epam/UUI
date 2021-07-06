import { IAnalyticsListener, AnalyticsEvent } from "@epam/uui";
import { AmplitudeClient } from "amplitude-js"

export class AmplitudeListener<TClient extends AmplitudeClient> implements IAnalyticsListener {

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