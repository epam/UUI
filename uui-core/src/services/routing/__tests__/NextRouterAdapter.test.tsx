import { NextRouterAdapter, TNext14Router } from '../NextRouterAdapter';
import { Link } from '../../../types';

describe('NextRouterAdapter', () => {
    let mockRouter: TNext14Router;
    let router: NextRouterAdapter;

    beforeEach(() => {
        mockRouter = {
            pathname: '/test',
            basePath: '',
            query: { param1: 'value1', param2: 'value2' },
            push: jest.fn(),
            replace: jest.fn(),
            events: {
                on: jest.fn(),
                off: jest.fn(),
                emit: jest.fn(),
            },
        };
        router = new NextRouterAdapter(mockRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getCurrentLink', () => {
        it('should return current link with parsed query', () => {
            const link = router.getCurrentLink();
            expect(link.pathname).toBe('/test');
            expect(link.query).toEqual({
                param1: 'value1',
                param2: 'value2',
            });
        });

        it('should parse JSON values in query params', () => {
            mockRouter.query = {
                obj: encodeURIComponent(JSON.stringify({ key: 'value' })),
            };
            const link = router.getCurrentLink();
            expect(link.query.obj).toEqual({ key: 'value' });
        });

        it('should handle non-JSON values in query params', () => {
            mockRouter.query = { simple: 'value' };
            const link = router.getCurrentLink();
            expect(link.query.simple).toBe('value');
        });

        it('should handle invalid JSON gracefully', () => {
            mockRouter.query = { invalid: 'not json {' };
            const link = router.getCurrentLink();
            expect(link.query.invalid).toBe('not json {');
        });
    });

    describe('parseLinkWithQuery', () => {
        it('should convert query object to search string', () => {
            const link: Link = {
                pathname: '/test',
                query: { key: 'value', nested: { obj: 'val' } },
            };
            const result = router.parseLinkWithQuery(link);
            expect(result.pathname).toBe('/test');
            expect(result.search).toBeDefined();
            expect(result.query).toBeUndefined();
        });

        it('should handle link without query', () => {
            const link: Link = { pathname: '/test' };
            const result = router.parseLinkWithQuery(link);
            expect(result.pathname).toBe('/test');
            expect(result.search).toBe('');
        });
    });

    describe('redirect', () => {
        it('should call router.push with parsed link', () => {
            const link: Link = {
                pathname: '/new-path',
                query: { key: 'value' },
            };
            router.redirect(link);
            expect(mockRouter.push).toHaveBeenCalledWith({
                pathname: '/new-path',
                search: expect.stringContaining('key=value'),
            });
        });

        it('should set blockedUrl when blocked', () => {
            const listener = jest.fn();
            router.block(listener);
            const link: Link = { pathname: '/new-path' };
            router.redirect(link);
            expect(router['blockedUrl']).toEqual(link);
        });

        it('should not set blockedUrl when not blocked', () => {
            const link: Link = { pathname: '/new-path' };
            router.redirect(link);
            expect(router['blockedUrl']).toBeNull();
        });
    });

    describe('transfer', () => {
        it('should call router.replace with parsed link', () => {
            const link: Link = {
                pathname: '/new-path',
                query: { key: 'value' },
            };
            router.transfer(link);
            expect(mockRouter.replace).toHaveBeenCalledWith({
                pathname: '/new-path',
                search: expect.stringContaining('key=value'),
            });
        });

        it('should set blockedUrl when blocked', () => {
            const listener = jest.fn();
            router.block(listener);
            const link: Link = { pathname: '/new-path' };
            router.transfer(link);
            expect(router['blockedUrl']).toEqual(link);
        });
    });

    describe('isActive', () => {
        it('should return true when pathname matches', () => {
            mockRouter.pathname = '/test';
            const link: Link = { pathname: '/test' };
            expect(router.isActive(link)).toBe(true);
        });

        it('should return false when pathname do not matches', () => {
            mockRouter.pathname = '/test';
            const link: Link = { pathname: '/other' };
            expect(router.isActive(link)).toBe(false);
        });
    });

    describe('createHref', () => {
        it('should create href with basePath', () => {
            mockRouter.basePath = '/base';
            const link: Link = { pathname: '/test', query: { key: 'value' } };
            const href = router.createHref(link);
            expect(href).toBe('/base/test?key=value');
        });

        it('should create href without basePath', () => {
            mockRouter.basePath = '';
            const link: Link = { pathname: '/test', query: { key: 'value' } };
            const href = router.createHref(link);
            expect(href).toBe('/test?key=value');
        });

        it('should handle link without query', () => {
            const link: Link = { pathname: '/test' };
            const href = router.createHref(link);
            expect(href).toBe('/test');
        });
    });

    describe('listen', () => {
        it('should subscribe to beforeHistoryChange event', () => {
            const listener = jest.fn();
            router.listen(listener);
            expect(mockRouter.events.on).toHaveBeenCalledWith('beforeHistoryChange', expect.any(Function));
        });

        it('should call listener when beforeHistoryChange event is emitted', () => {
            const listener = jest.fn();
            router.listen(listener);
            const handler = (mockRouter.events.on as jest.Mock).mock.calls[0][1];
            const link: Link = { pathname: '/test' };
            handler(link);
            expect(listener).toHaveBeenCalledWith(link);
        });

        it('should emit routeChangeError when blocked', () => {
            const listener = jest.fn();
            const listenListener = jest.fn();
            router.listen(listenListener);
            router.block(listener);
            router.redirect({ pathname: '/test' });
            // After redirect, blockedUrl is set and isBlockRun is true
            // Simulate beforeHistoryChange event being triggered
            const beforeHistoryHandler = (mockRouter.events.on as jest.Mock).mock.calls.find(
                (call: unknown[]) => call[0] === 'beforeHistoryChange',
            )?.[1];
            if (beforeHistoryHandler) {
                beforeHistoryHandler({ pathname: '/test' });
            }
            // routeChangeError should be emitted when beforeHistoryChange handler is called with blocked state
            expect(mockRouter.events.emit).toHaveBeenCalledWith('routeChangeError');
        });

        it('should return unsubscribe function', () => {
            const listener = jest.fn();
            const unsubscribe = router.listen(listener);
            unsubscribe();
            expect(mockRouter.events.off).toHaveBeenCalledWith('beforeHistoryChange', expect.any(Function));
        });
    });

    describe('block', () => {
        it('should subscribe to routeChangeError event', () => {
            const listener = jest.fn();
            router.block(listener);
            expect(mockRouter.events.on).toHaveBeenCalledWith('routeChangeError', expect.any(Function));
        });

        it('should set isBlockRun to true', () => {
            const listener = jest.fn();
            router.block(listener);
            expect(router['isBlockRun']).toBe(true);
        });

        it('should call listener and throw error when routeChangeError is emitted', () => {
            const listener = jest.fn();
            router.block(listener);
            router.redirect({ pathname: '/test' });
            const handler = (mockRouter.events.on as jest.Mock).mock.calls.find(
                (call: unknown[]) => call[0] === 'routeChangeError',
            )?.[1];
            expect(() => {
                if (handler) handler();
            }).toThrow('Block history changing');
            expect(listener).toHaveBeenCalledWith(router['blockedUrl']);
        });

        it('should return unsubscribe function', () => {
            const listener = jest.fn();
            const unsubscribe = router.block(listener);
            expect(router['isBlockRun']).toBe(true);
            unsubscribe();
            expect(router['isBlockRun']).toBe(false);
            expect(router['blockedUrl']).toBeNull();
            expect(mockRouter.events.off).toHaveBeenCalledWith('routeChangeError', expect.any(Function));
        });
    });
});
