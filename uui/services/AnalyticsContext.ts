import {BaseContext} from './BaseContext';
import {AnalyticsEvent, IRouterContext, IAnalyticsListener} from '../types';

interface AnalyticsContextOptions {
    gaCode?: string;
    router: IRouterContext;
}

export class AnalyticsContext extends BaseContext {
    public readonly gaCode?: string;
    private readonly router: IRouterContext;
    public listener: IAnalyticsListener;

    constructor(options: AnalyticsContextOptions) {
        super();

        if (!options.gaCode && !this.listener) return;

        this.gaCode = options.gaCode;
        this.router = options.router;

        this.initGA();

        this.sendToGA('js', new Date());
        this.sendPageView(window.location.pathname);

        this.listenRouter();
    }

    public sendEvent(event: AnalyticsEvent | null | undefined) {
        if (!event) return;

        this.sendToGA('event', event.name, this.getParameters(event));
        if (this.listener) this.listener.sendEvent(event, this.getParameters(event));
    }

    public sendPageView(path: string) {
        this.sendToGA('config', this.gaCode, {page_path: path, anonymize_ip: true});
    }

    public sendApiTiming(event: AnalyticsEvent & {parameters: object}) {
        this.sendToGA('event', event.name, event.parameters);
    }

    public sendEventToGA(event: AnalyticsEvent | null | undefined) {
        if (!event) return;
        this.sendToGA('event', event.name, this.getParameters(event));
    }

    public addListener(listener: IAnalyticsListener) {
        this.listener = listener;
    }

    private initGA() {
        if (!this.gaCode) return;

        (window as any).dataLayer = (window as any).dataLayer || [];

        const gtagScript = document.createElement('script');
        gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaCode}`;
        gtagScript.async = true;
        document.head.appendChild(gtagScript);
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