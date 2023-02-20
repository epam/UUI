import { AnalyticsEvent, IAnalyticsListener } from '../../types/contexts';

export class GAListener implements IAnalyticsListener {
    public gaCode: string;

    constructor(gaCode: string) {
        this.gaCode = gaCode;

        this.init();
    }

    public init() {
        this.addGaScript();
        this.sendToGA('js', new Date());
        this.sendPageView(window.location.pathname);
    }

    private addGaScript() {
        (window as any).dataLayer = (window as any).dataLayer || [];

        const gtagScript = document.createElement('script');
        gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaCode}`;
        gtagScript.async = true;
        document.head.appendChild(gtagScript);
    }

    public sendEvent(event: AnalyticsEvent, parameters: Omit<AnalyticsEvent, 'name'>, eventType?: string) {
        switch (eventType) {
            case 'pageView':
                this.sendPageView(event.path);
                break;

            default:
                this.sendToGA('event', event.name, parameters);
                break;
        }
    }

    private sendToGA(...args: any[]) {
        (window as any).dataLayer.push(arguments);
    }

    private sendPageView(path: string) {
        this.sendToGA('config', this.gaCode, { page_path: path, anonymize_ip: true });
    }
}
