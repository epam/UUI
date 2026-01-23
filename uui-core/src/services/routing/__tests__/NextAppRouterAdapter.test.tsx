import { NextAppRouterAdapter, ReadonlySearchParams, TNextAppRouter } from '../NextAppRouterAdapter';
import { Link } from '../../../types';

describe('NextAppRouterAdapter', () => {
    let mockRouter: TNextAppRouter;
    let router: NextAppRouterAdapter;
    let mockSearchParams: ReadonlySearchParams;

    beforeEach(() => {
        mockRouter = {
            push: jest.fn(),
            replace: jest.fn(),
        };
        router = new NextAppRouterAdapter(mockRouter);

        mockSearchParams = new URLSearchParams('param1=value1&param2=value2') as ReadonlySearchParams;
        router.updateURLParams('/test', mockSearchParams);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('updateURLParams', () => {
        it('should update pathname and searchParams', () => {
            const newSearchParams = new URLSearchParams('new=param') as ReadonlySearchParams;
            router.updateURLParams('/new-path', newSearchParams);
            const link = router.getCurrentLink();
            expect(link.pathname).toBe('/new-path');
            expect(link.query.new).toBe('param');
        });
    });

    describe('getCurrentLink', () => {
        it('should return current link with parsed query from searchParams', () => {
            const link = router.getCurrentLink();
            expect(link.pathname).toBe('/test');
            expect(link.query).toEqual({
                param1: 'value1',
                param2: 'value2',
            });
        });

        it('should return default link when pathname is not set', () => {
            const newRouter = new NextAppRouterAdapter(mockRouter);
            const link = newRouter.getCurrentLink();
            expect(link.pathname).toBe('');
            expect(link.query).toEqual({});
        });

        it('should parse JSON values in query params', () => {
            const jsonParam = encodeURIComponent(JSON.stringify({ key: 'value' }));
            const searchParams = new URLSearchParams(`obj=${jsonParam}`) as ReadonlySearchParams;
            router.updateURLParams('/test', searchParams);
            const link = router.getCurrentLink();
            expect(link.query.obj).toEqual({ key: 'value' });
        });

        it('should handle non-JSON values in query params', () => {
            const searchParams = new URLSearchParams('simple=value') as ReadonlySearchParams;
            router.updateURLParams('/test', searchParams);
            const link = router.getCurrentLink();
            expect(link.query.simple).toBe('value');
        });

        it('should handle invalid JSON gracefully', () => {
            const searchParams = new URLSearchParams('invalid=not%20json%20{') as ReadonlySearchParams;
            router.updateURLParams('/test', searchParams);
            const link = router.getCurrentLink();
            expect(link.query.invalid).toBe('not json {');
        });
    });

    describe('redirect', () => {
        it('should dispatch beforeHistoryChange event', () => {
            const dispatchSpy = jest.spyOn(document, 'dispatchEvent');
            const link: Link = { pathname: '/new-path' };
            router.redirect(link);
            expect(dispatchSpy).toHaveBeenCalled();
            const event = dispatchSpy.mock.calls[0][0];
            expect(event.type).toBe('beforeHistoryChange');
        });

        it('should call router.push when not blocked', () => {
            const link: Link = { pathname: '/new-path', search: 'key=value' };
            router.redirect(link);
            expect(mockRouter.push).toHaveBeenCalledWith('/new-path?key=value');
        });

        it('should handle link with search string', () => {
            const link: Link = { pathname: '/new-path', search: 'existing=search' };
            router.redirect(link);
            expect(mockRouter.push).toHaveBeenCalledWith('/new-path?existing=search');
        });

        it('should dispatch blockNavigation event when blocked', () => {
            const listener = jest.fn();
            router.block(listener);
            const dispatchSpy = jest.spyOn(document, 'dispatchEvent');
            const link: Link = { pathname: '/new-path' };
            router.redirect(link);
            expect(dispatchSpy).toHaveBeenCalled();
            const blockEvent = dispatchSpy.mock.calls.find((call) => call[0].type === 'blockNavigation');
            expect(blockEvent).toBeDefined();
            expect((blockEvent![0] as CustomEvent).detail.link).toEqual(link);
            expect(mockRouter.push).not.toHaveBeenCalled();
        });
    });

    describe('transfer', () => {
        it('should dispatch beforeHistoryChange event', () => {
            const dispatchSpy = jest.spyOn(document, 'dispatchEvent');
            const link: Link = { pathname: '/new-path' };
            router.transfer(link);
            expect(dispatchSpy).toHaveBeenCalled();
        });

        it('should call router.replace when not blocked', () => {
            const link: Link = { pathname: '/new-path', search: 'key=value' };
            router.transfer(link);
            expect(mockRouter.replace).toHaveBeenCalledWith('/new-path?key=value');
        });

        it('should dispatch blockNavigation event when blocked', () => {
            const listener = jest.fn();
            router.block(listener);
            const link: Link = { pathname: '/new-path' };
            router.transfer(link);
            expect(mockRouter.replace).not.toHaveBeenCalled();
        });
    });

    describe('isActive', () => {
        it('should return true when pathname matches', () => {
            router.updateURLParams('/test', mockSearchParams);
            const link: Link = { pathname: '/test' };
            expect(router.isActive(link)).toBe(true);
        });

        it('should return false when pathname do not matches', () => {
            router.updateURLParams('/test', mockSearchParams);
            const link: Link = { pathname: '/other' };
            expect(router.isActive(link)).toBe(false);
        });
    });

    describe('createHref', () => {
        it('should create href with basePath from env', () => {
            const originalBasePath = process.env.NEXT_PUBLIC_BASE_PATH;
            process.env.NEXT_PUBLIC_BASE_PATH = '/base';
            const link: Link = { pathname: '/test', query: { key: 'value' } };
            const href = router.createHref(link);
            expect(href).toBe('/base/test?key=value');
            process.env.NEXT_PUBLIC_BASE_PATH = originalBasePath;
        });

        it('should create href without basePath when env is not set', () => {
            const originalBasePath = process.env.NEXT_PUBLIC_BASE_PATH;
            delete process.env.NEXT_PUBLIC_BASE_PATH;
            const link: Link = { pathname: '/test', query: { key: 'value' } };
            const href = router.createHref(link);
            expect(href).toBe('/test?key=value');
            process.env.NEXT_PUBLIC_BASE_PATH = originalBasePath;
        });

        it('should handle link without query', () => {
            const originalBasePath = process.env.NEXT_PUBLIC_BASE_PATH;
            delete process.env.NEXT_PUBLIC_BASE_PATH;
            const link: Link = { pathname: '/test' };
            const href = router.createHref(link);
            expect(href).toBe('/test');
            process.env.NEXT_PUBLIC_BASE_PATH = originalBasePath;
        });
    });

    describe('listen', () => {
        it('should add event listener for beforeHistoryChange', () => {
            const listener = jest.fn();
            const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
            router.listen(listener);
            expect(addEventListenerSpy).toHaveBeenCalledWith('beforeHistoryChange', expect.any(Function));
        });

        it('should call listener when beforeHistoryChange event is dispatched', () => {
            const listener = jest.fn();
            router.listen(listener);
            const event = new CustomEvent('beforeHistoryChange', {
                detail: { link: { pathname: '/test' } },
            });
            document.dispatchEvent(event);
            expect(listener).toHaveBeenCalledWith({ pathname: '/test' });
        });

        it('should return unsubscribe function', () => {
            const listener = jest.fn();
            const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
            const unsubscribe = router.listen(listener);
            unsubscribe();
            expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeHistoryChange', expect.any(Function));
        });
    });

    describe('block', () => {
        it('should set isBlockRun to true', () => {
            const listener = jest.fn();
            router.block(listener);
            const link: Link = { pathname: '/test' };
            router.redirect(link);
            expect(mockRouter.push).not.toHaveBeenCalled();
        });

        it('should add event listener for blockNavigation', () => {
            const listener = jest.fn();
            const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
            router.block(listener);
            expect(addEventListenerSpy).toHaveBeenCalledWith('blockNavigation', expect.any(Function));
        });

        it('should call listener when blockNavigation event is dispatched', () => {
            const listener = jest.fn();
            router.block(listener);
            const link: Link = { pathname: '/test' };
            const event = new CustomEvent('blockNavigation', {
                detail: { link },
            });
            document.dispatchEvent(event);
            expect(listener).toHaveBeenCalledWith(link);
        });

        it('should return unsubscribe function that sets isBlockRun to false', () => {
            const listener = jest.fn();
            const unsubscribe = router.block(listener);
            expect(router['isBlockRun']).toBe(true);
            unsubscribe();
            expect(router['isBlockRun']).toBe(false);
        });

        it('should allow navigation after unblocking', () => {
            const listener = jest.fn();
            const unsubscribe = router.block(listener);
            const link: Link = { pathname: '/test' };
            router.redirect(link);
            expect(mockRouter.push).not.toHaveBeenCalled();
            unsubscribe();
            router.redirect(link);
            expect(mockRouter.push).toHaveBeenCalled();
        });
    });
});
