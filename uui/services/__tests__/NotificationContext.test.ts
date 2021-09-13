import { NotificationContext } from "../NotificationContext";
import { LayoutContext } from "../LayoutContext";

describe("NotificationContext", () => {
    let context: NotificationContext;

    beforeEach(() => {
        context = new NotificationContext(new LayoutContext());
    });
    
    it("should create operations", () => {
        context.show(() => "", {});
        expect(context.getNotifications().length).toBe(1);
        
        context.show(() => "", {});
        expect(context.getNotifications().length).toBe(2);
    });

    it("should remove operations", () => {
        context.show(() => "", {});
        context.show(() => "", {});
        
        expect(context.getNotifications()[0].props.id).toBe(0);
        expect(context.getNotifications()[1].props.id).toBe(1);
        
        context.remove(0);
        expect(context.getNotifications()[0].props.id).toBe(1);
    });

    it("should clear all operations", () => {
        context.show(() => "", {});
        context.show(() => "", {});
        expect(context.getNotifications().length).toBe(2);

        context.handleRedirect();
        expect(context.getNotifications().length).toBe(0);
        
        context.show(() => "", {});
        context.show(() => "", {});
        expect(context.getNotifications().length).toBe(2);

        context.clearAll();
        expect(context.getNotifications().length).toBe(0);
    });
});