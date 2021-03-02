import {AmplitudeClient, getInstance} from "amplitude-js";
import {BaseContext} from './BaseContext';
import {AnalyticsEvent, IRouterContext} from '../types';

interface AnalyticsContextOptions {
    gaCode?: string;
    ampCode?: string;
    router: IRouterContext;
}

export class AnalyticsContext extends BaseContext {
    public readonly gaCode?: string;
    public readonly ampCode?: string;
    private readonly router: IRouterContext;
    private ampClient: AmplitudeClient;

    constructor(options: AnalyticsContextOptions) {
        super();

        if (!options.gaCode && !options.ampCode) return;

        this.gaCode = options.gaCode;
        this.ampCode = options.ampCode;
        this.router = options.router;

        this.initGA();
        this.initAmp();

        this.sendToGA('js', new Date());
        this.sendPageView(window.location.pathname);

        this.listenRouter();
    }

    public sendEvent(event: AnalyticsEvent | null | undefined) {
        if (!event) return;
        
        this.sendToGA('event', event.name, this.getParameters(event));
        this.sendEventToAmplitude(event);
    }

    public sendPageView(path: string) {
        this.sendToGA('config', this.gaCode, {page_path: path});
    }
    
    public sendApiTiming(event: AnalyticsEvent & {parameters: object}) {
        this.sendToGA('event', event.name, event.parameters);
    }

    public sendEventToGA(event: AnalyticsEvent | null | undefined) {
        if (!event) return;
        this.sendToGA('event', event.name, this.getParameters(event));
    }

    public sendEventToAmplitude(event: AnalyticsEvent | null | undefined) {
        if (!event) return;
        this.ampCode && this.ampClient.logEvent(event.name, this.getParameters(event));
    }
    
    private initGA() {
        if (!this.gaCode) return;

        (window as any).dataLayer = (window as any).dataLayer || [];

        const gtagScript = document.createElement('script');
        gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaCode}`;
        gtagScript.async = true;
        document.head.appendChild(gtagScript);
    }

    private initAmp() {
        if (!this.ampCode) return;

        this.ampClient = getInstance();
        this.ampClient.init(this.ampCode);
    }

    private sendToGA(...args: any[]) {
        this.gaCode && (window as any).dataLayer.push(arguments);
    }

    private listenRouter() {
        let currentLocation = window.location.pathname;
        this.router && this.router.listen((location) => {
            if (currentLocation !== location.pathname) {
                currentLocation = location.pathname;
                this.sendPageView(location.pathname);
            }
        });
    }

    private getParameters(options: AnalyticsEvent) {
        const parameters: any = { ...options };
        delete parameters.name;
        return parameters;
    }
}