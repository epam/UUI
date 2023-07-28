import { BaseContext } from './BaseContext';
import { AnalyticsEvent, IRouterContext, IAnalyticsListener, Link } from '../types';
import { isClientSide } from '../helpers';

interface AnalyticsContextOptions {
    router: IRouterContext;
}

export class AnalyticsContext extends BaseContext {
    private removeRouteListener: () => void;
    private currentLocation: string;
    private readonly router: IRouterContext;
    public listeners: IAnalyticsListener[] = [];
    constructor(options: AnalyticsContextOptions) {
        super();

        this.router = options.router;

        if (isClientSide) {
            this.currentLocation = window.location?.pathname;
            this.removeRouteListener = this.router?.listen(this.handleChangeRoute);
        }
    }

    public destroyContext() {
        super.destroyContext();
        if (isClientSide) {
            this.removeRouteListener?.();
        }
    }

    public sendEvent(event: AnalyticsEvent | null | undefined, eventType: 'event' | 'pageView' | 'apiTiming' = 'event') {
        if (!event) return;
        if (this.listeners.length) this.listeners.forEach((listener) => listener.sendEvent(event, this.getParameters(event), eventType));
    }

    private handleChangeRoute = (location: Link) => {
        if (this.currentLocation !== location?.pathname) {
            this.currentLocation = location?.pathname;
            this.sendEvent({ path: location?.pathname, name: 'pageView' }, 'pageView');
        }
    };

    public addListener(listener: IAnalyticsListener) {
        this.listeners.push(listener);
    }

    private getParameters(options: AnalyticsEvent) {
        const parameters: any = { ...options };
        delete parameters.name;
        return parameters;
    }
}
