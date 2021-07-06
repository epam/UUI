import {BaseContext} from './BaseContext';
import {AnalyticsEvent, IRouterContext, IAnalyticsListener} from '../types';
import { GAListener } from './analytics/GAListener';

interface AnalyticsContextOptions {
    gaCode?: string;
    router: IRouterContext;
}

export class AnalyticsContext extends BaseContext {
    public readonly gaCode?: string;
    private readonly router: IRouterContext;
    public listeners: IAnalyticsListener[] = [];

    constructor(options: AnalyticsContextOptions) {
        super();

        if (!options.gaCode && !this.listeners.length) return;

        this.gaCode = options.gaCode;
        this.router = options.router;
        if (this.gaCode) this.initGA();
    }

    public sendEvent(event: AnalyticsEvent | null | undefined) {
        if (!event) return;
        if (this.listeners.length) this.listeners.forEach(listener => listener.sendEvent(event, this.getParameters(event)));
    }

    public sendApiTiming(event: AnalyticsEvent & {parameters: object}) {
        this.sendEventToGA(event, "event");
    }

    public sendEventToGA(event: AnalyticsEvent | null | undefined, eventType:string) {
        const gaClient = this.listeners.find(listener => listener instanceof GAListener);
        if (gaClient) {
            gaClient.sendEvent(event, this.getParameters(event), eventType);
        }
    }

    public addListener(listener: IAnalyticsListener) {
        this.listeners.push(listener);
    }

    private initGA() {
        if (!this.gaCode) return;
        const gaClient = new GAListener(this.gaCode, this.router, "GAClient");
        gaClient.init();
        this.listeners.push(gaClient);
    }

    private getParameters(options: AnalyticsEvent) {
        const parameters: any = { ...options };
        delete parameters.name;
        return parameters;
    }
}