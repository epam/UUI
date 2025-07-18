import { IAnalyticsListener } from '../../types/contexts';
import { AnalyticsEvent } from '../../types/objects';

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

    private hasConsent(): boolean {
        const dataLayer = (window as any).dataLayer ?? [];
        return dataLayer.length === 0 ? false : dataLayer.some((item: any) => item.event === 'OneTrustLoaded' && item.OnetrustActiveGroups?.includes('C0002'));
    }

    public sendEvent(event: AnalyticsEvent, parameters: Omit<AnalyticsEvent, 'name'>, eventType?: string) {
        if (!this.hasConsent()) {
            return; // Do not send events if cookie consent is not given
        }
        switch (eventType) {
            case 'pageView':
                this.sendPageView(event.path);
                break;

            default:
                this.sendToGA('event', event.name, parameters);
                break;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private sendToGA(...args: any[]) {
        (window as any).dataLayer.push(arguments); // For GA it's important to pass exactly arguments
    }

    private sendPageView(path: string) {
        this.sendToGA('config', this.gaCode, { page_path: path, anonymize_ip: true });
    }
}
