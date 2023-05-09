import { BaseContext } from './BaseContext';
import { AnalyticsEvent, IRouterContext, IAnalyticsListener } from '../types';
import { isClientSide } from '../helpers';

interface AnalyticsContextOptions {
    router: IRouterContext;
}

export class AnalyticsContext extends BaseContext {
    private readonly router: IRouterContext;
    public listeners: IAnalyticsListener[] = [];
    constructor(options: AnalyticsContextOptions) {
        super();

        this.router = options.router;

        this.listenRouter();
    }

    public sendEvent(event: AnalyticsEvent | null | undefined, eventType: 'event' | 'pageView' | 'apiTiming' = 'event') {
        if (!event) return;
        if (this.listeners.length) this.listeners.forEach((listener) => listener.sendEvent(event, this.getParameters(event), eventType));
    }

    private listenRouter() {
        if (!isClientSide) return;
        let currentLocation = window.location?.pathname;
        this.router
            && this.router.listen((location) => {
                if (currentLocation !== location?.pathname) {
                    currentLocation = location?.pathname;
                    this.sendEvent({ path: location?.pathname, name: 'pageView' }, 'pageView');
                }
            });
    }

    public addListener(listener: IAnalyticsListener) {
        this.listeners.push(listener);
    }

    private getParameters(options: AnalyticsEvent) {
        const parameters: any = { ...options };
        delete parameters.name;
        return parameters;
    }
}
