import { Router6AdaptedRouter, getRouter6BlockFn, getBeforeUnloadSingletone } from '../Router6AdaptedRouter';
import { IRouter6, Action } from '../interfaces/IRouter6';
import { Link } from '../../../types';

describe('Router6AdaptedRouter', () => {
    let mockRouter: IRouter6;
    let router: Router6AdaptedRouter;

    beforeEach(() => {
        mockRouter = {
            state: {
                location: {
                    pathname: '/test',
                    search: '?param1=value1&param2=value2',
                    hash: '',
                    key: 'default',
                    state: null,
                },
                blockers: new Map(),
                historyAction: Action.Push,
            },
            navigate: jest.fn(),
            getBlocker: jest.fn(),
            subscribe: jest.fn(() => jest.fn()),
            deleteBlocker: jest.fn(),
            createHref: jest.fn((location) => `${location.pathname}${location.search || ''}${location.hash || ''}`),
        };
        router = new Router6AdaptedRouter(mockRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getCurrentLink', () => {
        it('should return current link with parsed query from location', () => {
            const link = router.getCurrentLink();
            expect(link.pathname).toBe('/test');
            expect(link.query).toEqual({
                param1: 'value1',
                param2: 'value2',
            });
        });

        it('should handle empty search string', () => {
            mockRouter.state.location = {
                pathname: '/test',
                search: '',
                hash: '',
                key: 'default',
                state: null,
            };
            const link = router.getCurrentLink();
            expect(link.pathname).toBe('/test');
            expect(link.query).toEqual({});
        });

        it('should parse JSON values in query params', () => {
            const jsonParam = encodeURIComponent(JSON.stringify({ key: 'value' }));
            mockRouter.state.location = {
                pathname: '/test',
                search: `?obj=${jsonParam}`,
                hash: '',
                key: 'default',
                state: null,
            };
            const link = router.getCurrentLink();
            expect(link.query.obj).toEqual({ key: 'value' });
        });
    });

    describe('redirect', () => {
        it('should call router.navigate with string link', () => {
            router.redirect('/new-path');
            expect(mockRouter.navigate).toHaveBeenCalledWith('/new-path');
        });

        it('should call router.navigate with Link object', () => {
            const link: Link = {
                pathname: '/new-path',
                query: { key: 'value' },
            };
            router.redirect(link);
            expect(mockRouter.navigate).toHaveBeenCalledWith(
                {
                    pathname: '/new-path',
                    search: 'key=value',
                    hash: '',
                },
                { state: undefined },
            );
        });

        it('should handle link with state', () => {
            const link: Link = {
                pathname: '/new-path',
                state: { some: 'state' },
            };
            router.redirect(link);
            expect(mockRouter.navigate).toHaveBeenCalledWith(
                expect.objectContaining({
                    pathname: '/new-path',
                }),
                { state: { some: 'state' } },
            );
        });

        it('should handle link with hash', () => {
            const link: Link = {
                pathname: '/new-path',
                hash: '#section',
            };
            router.redirect(link);
            expect(mockRouter.navigate).toHaveBeenCalledWith(
                expect.objectContaining({
                    hash: '#section',
                }),
                { state: undefined },
            );
        });

        it('should prefer query over search when both are present', () => {
            const link: Link = {
                pathname: '/new-path',
                query: { key: 'value' },
                search: '?other=param',
            };
            router.redirect(link);
            expect(mockRouter.navigate).toHaveBeenCalledWith(
                expect.objectContaining({
                    search: 'key=value',
                }),
                expect.any(Object),
            );
        });
    });

    describe('transfer', () => {
        it('should call router.navigate with replace option', () => {
            const link: Link = {
                pathname: '/new-path',
                query: { key: 'value' },
            };
            router.transfer(link);
            expect(mockRouter.navigate).toHaveBeenCalledWith(
                {
                    pathname: '/new-path',
                    search: 'key=value',
                    hash: '',
                },
                { state: undefined, replace: true },
            );
        });

        it('should handle link with state', () => {
            const link: Link = {
                pathname: '/new-path',
                state: { some: 'state' },
            };
            router.transfer(link);
            expect(mockRouter.navigate).toHaveBeenCalledWith(
                expect.any(Object),
                { state: { some: 'state' }, replace: true },
            );
        });
    });

    describe('isActive', () => {
        it('should return true when pathname matches', () => {
            mockRouter.state.location = {
                pathname: '/test',
                search: '',
                hash: '',
                key: 'default',
                state: null,
            };
            const link: Link = { pathname: '/test' };
            expect(router.isActive(link)).toBe(true);
        });

        it('should return false when pathname do not matches', () => {
            mockRouter.state.location = {
                pathname: '/test',
                search: '',
                hash: '',
                key: 'default',
                state: null,
            };
            const link: Link = { pathname: '/other' };
            expect(router.isActive(link)).toBe(false);
        });
    });

    describe('createHref', () => {
        it('should call router.createHref with converted location', () => {
            const link: Link = {
                pathname: '/test',
                query: { key: 'value' },
                hash: '#section',
            };
            router.createHref(link);
            expect(mockRouter.createHref).toHaveBeenCalledWith({
                pathname: '/test',
                search: 'key=value',
                hash: '#section',
                key: '',
                state: undefined,
            });
        });

        it('should handle link without query, hash, or key', () => {
            const link: Link = { pathname: '/test' };
            router.createHref(link);
            expect(mockRouter.createHref).toHaveBeenCalledWith({
                pathname: '/test',
                search: '',
                hash: '',
                key: '',
                state: undefined,
            });
        });
    });

    describe('listen', () => {
        it('should subscribe to router state changes', () => {
            const listener = jest.fn();
            router.listen(listener);
            expect(mockRouter.subscribe).toHaveBeenCalled();
        });

        it('should call listener with location when state changes', () => {
            const listener = jest.fn();
            router.listen(listener);
            const subscribeFn = (mockRouter.subscribe as jest.Mock).mock.calls[0][0];
            const newState = {
                location: {
                    pathname: '/new',
                    search: '',
                    hash: '',
                    key: 'new-key',
                    state: null,
                },
                blockers: new Map(),
                historyAction: Action.Push,
            };
            subscribeFn(newState);
            expect(listener).toHaveBeenCalledWith(newState.location);
        });

        it('should return unsubscribe function', () => {
            const listener = jest.fn();
            const unsubscribe = jest.fn();
            (mockRouter.subscribe as jest.Mock).mockReturnValue(unsubscribe);
            const result = router.listen(listener);
            expect(result).toBe(unsubscribe);
        });
    });

    describe('block', () => {
        it('should use getRouter6BlockFn', () => {
            const listener = jest.fn();
            router.block(listener);
            expect((mockRouter.getBlocker as jest.Mock)).toHaveBeenCalled();
        });
    });
});

describe('getBeforeUnloadSingleton', () => {
    let beforeUnloadSingleton: ReturnType<typeof getBeforeUnloadSingletone>;
    let addEventListenerSpy: jest.SpyInstance;
    let removeEventListenerSpy: jest.SpyInstance;

    beforeEach(() => {
        beforeUnloadSingleton = getBeforeUnloadSingletone();
        addEventListenerSpy = jest.spyOn(window, 'addEventListener');
        removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should add beforeunload listener on ensureBlock', () => {
        beforeUnloadSingleton.ensureBlock();
        expect(addEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
    });

    it('should not add duplicate listeners', () => {
        beforeUnloadSingleton.ensureBlock();
        beforeUnloadSingleton.ensureBlock();
        expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
    });

    it('should remove listener on unblock', () => {
        beforeUnloadSingleton.ensureBlock();
        const handler = addEventListenerSpy.mock.calls[0][1];
        beforeUnloadSingleton.unblock();
        expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeunload', handler);
    });

    it('should prevent default on beforeunload event', () => {
        beforeUnloadSingleton.ensureBlock();
        const handler = addEventListenerSpy.mock.calls[0][1];
        const event = { preventDefault: jest.fn() } as unknown as BeforeUnloadEvent;
        handler(event);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should handle unblock when no listener is set', () => {
        expect(() => beforeUnloadSingleton.unblock()).not.toThrow();
    });
});

describe('getRouter6BlockFn', () => {
    let mockRouter: IRouter6;
    let blockFn: ReturnType<typeof getRouter6BlockFn>;

    beforeEach(() => {
        mockRouter = {
            state: {
                location: {
                    pathname: '/test',
                    search: '',
                    hash: '',
                    key: 'default',
                    state: null,
                },
                blockers: new Map(),
                historyAction: Action.Push,
            },
            navigate: jest.fn(),
            getBlocker: jest.fn(),
            subscribe: jest.fn(() => jest.fn()),
            deleteBlocker: jest.fn(),
            createHref: jest.fn(),
        };
        blockFn = getRouter6BlockFn(mockRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create blocker with unique key', () => {
        const blockerFunction = jest.fn();
        blockFn(blockerFunction);
        expect(mockRouter.getBlocker).toHaveBeenCalledWith('uui-1', expect.any(Function));
    });

    it('should create blockers with incrementing keys', () => {
        const blockerFunction = jest.fn();
        blockFn(blockerFunction);
        blockFn(blockerFunction);
        expect(mockRouter.getBlocker).toHaveBeenCalledWith('uui-1', expect.any(Function));
        expect(mockRouter.getBlocker).toHaveBeenCalledWith('uui-2', expect.any(Function));
    });

    it('should call blocker function with mapped action', () => {
        const blockerFunction = jest.fn();
        blockFn(blockerFunction);
        const internalBlocker = (mockRouter.getBlocker as jest.Mock).mock.calls[0][1];
        const params = {
            nextLocation: {
                pathname: '/new',
                search: '',
                hash: '',
                key: 'new-key',
                state: null,
            },
            historyAction: Action.Push,
        };
        internalBlocker(params);
        expect(blockerFunction).toHaveBeenCalledWith(params.nextLocation, 'PUSH');
    });

    it('should map Action.Pop to POP', () => {
        const blockerFunction = jest.fn();
        blockFn(blockerFunction);
        const internalBlocker = (mockRouter.getBlocker as jest.Mock).mock.calls[0][1];
        const params = {
            nextLocation: {
                pathname: '/new',
                search: '',
                hash: '',
                key: 'new-key',
                state: null,
            },
            historyAction: Action.Pop,
        };
        internalBlocker(params);
        expect(blockerFunction).toHaveBeenCalledWith(params.nextLocation, 'POP');
    });

    it('should map Action.Replace to REPLACE', () => {
        const blockerFunction = jest.fn();
        blockFn(blockerFunction);
        const internalBlocker = (mockRouter.getBlocker as jest.Mock).mock.calls[0][1];
        const params = {
            nextLocation: {
                pathname: '/new',
                search: '',
                hash: '',
                key: 'new-key',
                state: null,
            },
            historyAction: Action.Replace,
        };
        internalBlocker(params);
        expect(blockerFunction).toHaveBeenCalledWith(params.nextLocation, 'REPLACE');
    });

    it('should return true from blocker function to block navigation', () => {
        const blockerFunction = jest.fn();
        blockFn(blockerFunction);
        const internalBlocker = (mockRouter.getBlocker as jest.Mock).mock.calls[0][1];
        const params = {
            nextLocation: {
                pathname: '/new',
                search: '',
                hash: '',
                key: 'new-key',
                state: null,
            },
            historyAction: Action.Push,
        };
        const result = internalBlocker(params);
        expect(result).toBe(true);
    });

    it('should delete blocker on unsubscribe', () => {
        const blockerFunction = jest.fn();
        const unsubscribe = blockFn(blockerFunction);
        unsubscribe();
        expect(mockRouter.deleteBlocker).toHaveBeenCalledWith('uui-1');
    });

    it('should unblock beforeunload when all blockers are removed', () => {
        const blockerFunction = jest.fn();
        const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
        mockRouter.state.blockers = new Map([['uui-1', {}]]);
        const unsubscribe = blockFn(blockerFunction);
        mockRouter.state.blockers = new Map();
        unsubscribe();
        expect(removeEventListenerSpy).toHaveBeenCalled();
    });

    it('should not unblock beforeunload when other blockers exist', () => {
        const blockerFunction = jest.fn();
        const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
        mockRouter.state.blockers = new Map([
            ['uui-1', {}],
            ['uui-2', {}],
        ]);
        const unsubscribe = blockFn(blockerFunction);
        mockRouter.state.blockers = new Map([['uui-2', {}]]);
        unsubscribe();
        expect(removeEventListenerSpy).not.toHaveBeenCalled();
    });
});
