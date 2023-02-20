import { NotificationContext } from '../NotificationContext';
import { LayoutContext } from '../LayoutContext';

describe('NotificationContext', () => {
    let context: NotificationContext;

    beforeEach(() => {
        context = new NotificationContext(new LayoutContext());
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    it('should create operations', () => {
        context.show(() => '', { position: 'bot-left' });
        expect(context.getNotifications().length).toBe(1);

        let notification = context.getNotifications()[0];
        expect(notification.config.position).toBe('bot-left');
        expect(notification.config.duration).toBe(7);
        expect(notification.props.id).toBe(0);
        expect(notification.props.key).toBe('0');

        context.show(() => '', { position: 'top-right' });
        expect(context.getNotifications().length).toBe(2);

        notification = context.getNotifications()[1];
        expect(notification.config.position).toBe('top-right');
        expect(notification.config.duration).toBe(7);
        expect(notification.props.id).toBe(1);
        expect(notification.props.key).toBe('1');
    });

    it('should remove operations', () => {
        context.show(() => '', {});
        context.show(() => '', {});

        expect(context.getNotifications()[0].props.id).toBe(0);
        expect(context.getNotifications()[1].props.id).toBe(1);

        context.remove(0);
        expect(context.getNotifications()[0].props.id).toBe(1);
    });

    it('should clear all operations', () => {
        context.show(() => '', {});
        context.show(() => '', {});
        expect(context.getNotifications().length).toBe(2);

        context.handleRedirect();
        expect(context.getNotifications().length).toBe(0);

        context.show(() => '', {});
        context.show(() => '', {});
        expect(context.getNotifications().length).toBe(2);

        context.clearAll();
        expect(context.getNotifications().length).toBe(0);
    });

    it('should be removed after time end', () => {
        jest.useFakeTimers();

        let removeSpy = jest.spyOn(context, 'remove');
        context.show(() => '', { duration: 1 }).catch(() => {});

        jest.advanceTimersByTime(1000);
        expect(removeSpy).toBeCalledTimes(1);
        expect(context.getNotifications().length).toBe(0);
        removeSpy.mockRestore();

        removeSpy = jest.spyOn(context, 'remove');
        context.show(() => '', { duration: 1 }).catch(() => {});
        jest.advanceTimersByTime(900);
        expect(removeSpy).toBeCalledTimes(0);
        context.getNotifications()[0].props.refreshTimer();

        jest.advanceTimersByTime(900);
        expect(removeSpy).toBeCalledTimes(0);
        expect(context.getNotifications().length).toBe(1);

        jest.advanceTimersByTime(100);
        expect(removeSpy).toBeCalledTimes(1);

        jest.useRealTimers();
    });

    it('should not be removed', () => {
        jest.useFakeTimers();

        let removeSpy = jest.spyOn(context, 'remove');
        context.show(() => '', { duration: 'forever' }).catch(() => {});

        jest.advanceTimersByTime(15000);
        expect(removeSpy).not.toBeCalled();

        context.getNotifications()[0].props.onClose();
        removeSpy.mockRestore();

        removeSpy = jest.spyOn(context, 'remove');
        context.show(() => '', { duration: 1 }).catch(() => {});
        jest.advanceTimersByTime(900);

        context.getNotifications()[0].props.clearTimer();
        jest.advanceTimersByTime(1000);

        expect(removeSpy).not.toBeCalled();

        jest.useRealTimers();
    });
});
