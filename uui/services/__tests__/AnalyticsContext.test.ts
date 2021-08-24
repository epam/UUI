import { AnalyticsContext } from "../AnalyticsContext";
import { HistoryAdaptedRouter } from "../routing";

class RouterMock {
    listeners = [];
    
    constructor() {
        this.listen = this.listen.bind(this);
    }
    
    listen(listener: Function) {
        console.log("pushed listener");
        this.listeners.push(listener);
    }
    
    emit() {
        console.log("EMIT");
        this.listeners.forEach(l => l());
    }
}

describe("AnalyticsContext", () => {
    // let context: AnalyticsContext;
    //
    // beforeEach(() => {
    //     context = new AnalyticsContext({} as any);
    // });
    let windowSpy: any;
    let href = "/";
    beforeEach(() => {
        windowSpy = jest.spyOn(window, "window", "get")
            .mockImplementation(() => ({
                location: {
                    href,
                },
            } as any));
    });

    afterEach(() => {
        windowSpy.mockRestore();
    });

    it("should call listeners", () => {
        const context = new AnalyticsContext({} as any);

        const testEvent1 = {
            name: "test event 1",
        };
        const listener1 = {
            sendEvent: jest.fn(),
        };

        context.addListener(listener1);
        context.sendEvent(testEvent1);

        expect(listener1.sendEvent).toBeCalledTimes(1);
        expect(listener1.sendEvent).toBeCalledWith(testEvent1, {}, "event");

        const testEvent2 = {
            name: "test event 2",
        };
        const listener2 = {
            sendEvent: jest.fn(),
        };

        context.addListener(listener2);
        context.sendEvent(testEvent2);

        expect(listener1.sendEvent).toBeCalledTimes(2);
        expect(listener1.sendEvent).toBeCalledWith(testEvent2, {}, "event");
        expect(listener2.sendEvent).toBeCalledTimes(1);
        expect(listener2.sendEvent).toBeCalledWith(testEvent2, {}, "event");
    });

    it("should listen router", () => {
        const router = new RouterMock();
        const listener = {
            sendEvent: jest.fn(),
        };
        const context = new AnalyticsContext({
            router
        } as any);

        // context.addListener(listener);
        expect(router.listeners.length === 1);
        
        // router.emit();

        // expect(listener).toBeCalledTimes(1);
    });
});