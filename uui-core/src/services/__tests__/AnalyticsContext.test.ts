import { AnalyticsContext } from '../AnalyticsContext';

class RouterMock {
    listeners = [] as Function[];
    listen(listener: Function) {
        this.listeners.push(listener);
    }

    block() {}
}

describe('AnalyticsContext', () => {
    beforeEach(() => {
        (window as any).dataLayer = [];
    });
    afterEach(() => {
        delete (window as any).dataLayer;
    });

    it('should call listeners', () => {
        const context = new AnalyticsContext({} as any);

        const testEvent1 = {
            name: 'test event 1',
        };
        const listener1 = {
            sendEvent: jest.fn(),
        };

        context.addListener(listener1);
        context.sendEvent(testEvent1);

        expect(listener1.sendEvent).toBeCalledTimes(1);
        expect(listener1.sendEvent).toBeCalledWith(testEvent1, {}, 'event');

        const params = {
            param1: 'test param 1',
            param2: {
                inner: 'inner test param 2',
            },
        };

        const testEvent2 = {
            name: 'test event 2',
            ...params,
        };
        const listener2 = {
            sendEvent: jest.fn(),
        };

        context.addListener(listener2);
        context.sendEvent(testEvent2);

        expect(listener1.sendEvent).toBeCalledTimes(2);
        expect(listener1.sendEvent).toBeCalledWith(testEvent2, params, 'event');
        expect(listener2.sendEvent).toBeCalledTimes(1);
        expect(listener2.sendEvent).toBeCalledWith(testEvent2, params, 'event');
    });

    it('should listen router', () => {
        const router = new RouterMock();
        const context = new AnalyticsContext({
            router,
        } as any);
        context.init();
        const sendEventSpy = jest.spyOn(context, 'sendEvent');

        expect(router.listeners.length).toBe(1);

        router.listeners[0]();
        expect(sendEventSpy).toBeCalledTimes(1);
    });
});
