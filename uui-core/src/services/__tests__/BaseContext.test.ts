import { BaseContext } from '../BaseContext';

describe('BaseContext', () => {
    const context = new BaseContext<{}>();
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const handler3 = jest.fn();

    it('should work correctly', () => {
        let newState = { test: 'test info' };
        context.subscribe(handler1);
        context.update(newState);
        expect(handler1).toBeCalledTimes(1);
        expect(handler1).toBeCalledWith(newState);

        newState = { test: 'test info 2' };
        context.subscribe(handler2);
        context.update(newState);
        expect(handler1).toBeCalledTimes(2);
        expect(handler1).toBeCalledWith(newState);
        expect(handler2).toBeCalledTimes(1);
        expect(handler2).toBeCalledWith(newState);

        newState = { test: 'test info 3' };
        context.subscribe(handler3);
        context.update(newState);
        expect(handler1).toBeCalledTimes(3);
        expect(handler1).toBeCalledWith(newState);
        expect(handler2).toBeCalledTimes(2);
        expect(handler2).toBeCalledWith(newState);
        expect(handler3).toBeCalledTimes(1);
        expect(handler3).toBeCalledWith(newState);

        context.unsubscribe(handler2);
        context.update(newState);
        expect(handler1).toBeCalledTimes(4);
        expect(handler1).toBeCalledWith(newState);
        expect(handler2).toBeCalledTimes(2);
        expect(handler2).toBeCalledWith(newState);
        expect(handler3).toBeCalledTimes(2);
        expect(handler3).toBeCalledWith(newState);

        context.unsubscribe(handler1);
        context.update(newState);
        expect(handler1).toBeCalledTimes(4);
        expect(handler1).toBeCalledWith(newState);
        expect(handler2).toBeCalledTimes(2);
        expect(handler2).toBeCalledWith(newState);
        expect(handler3).toBeCalledTimes(3);
        expect(handler3).toBeCalledWith(newState);

        context.unsubscribe(handler3);
        context.update(newState);
        expect(handler1).toBeCalledTimes(4);
        expect(handler1).toBeCalledWith(newState);
        expect(handler2).toBeCalledTimes(2);
        expect(handler2).toBeCalledWith(newState);
        expect(handler3).toBeCalledTimes(3);
        expect(handler3).toBeCalledWith(newState);
    });
});
