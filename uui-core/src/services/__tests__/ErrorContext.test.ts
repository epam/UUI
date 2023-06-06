import { ErrorContext } from '../ErrorContext';

describe('ErrorContext', () => {
    it('should work correctly', () => {
        const context = new ErrorContext({} as any, {} as any);
        const callback = jest.fn();
        context.onError(callback);

        const error = new Error('Test error');
        context.reportError(error);
        expect(context.currentError).toBe(error);
        expect(callback).toBeCalledTimes(1);
        expect(callback).toBeCalledWith(error);

        context.discardError();
        expect(context.currentError).toBe(null);

        const listener = jest.fn();
        context.subscribe(listener);
        context.reportError(error);
        expect(listener).toBeCalledTimes(1);

        context.recover();
        expect(listener).toBeCalledTimes(2);
    });
});
