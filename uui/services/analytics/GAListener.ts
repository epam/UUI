import { AnalyticsEvent, IAnalyticsListener, IRouterContext } from "../../types/contexts";

export class GAListener implements IAnalyticsListener {
    public gaCode: string;
    private readonly router: IRouterContext;
    public name: string;

    constructor(gaCode:string, router: IRouterContext, name: string ) {
        this.gaCode = gaCode;
        this.router = router;
        this.name = name;
        this.init();
    }

    public init() {
        this.addGaScript();
        this.sendToGA('js', new Date());
        this.sendPageView(window.location.pathname);
        this.listenRouter();
    }

    private addGaScript() {
        (window as any).dataLayer = (window as any).dataLayer || [];

        const gtagScript = document.createElement('script');
        gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaCode}`;
        gtagScript.async = true;
        document.head.appendChild(gtagScript);
    }

    public sendEvent(event:AnalyticsEvent, parameters: Omit<AnalyticsEvent, "name">, eventType: string) {
        this.sendToGA(eventType || "event", event.name, parameters)
    }

    public sendToGA(...args: any[]) {
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

    private sendPageView(path: string) {
        this.sendToGA('config', this.gaCode, {page_path: path, anonymize_ip: true});
    }

}