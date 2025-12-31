import { HistoryAdaptedRouter, IHistory4 } from '../HistoryAdaptedRouter';
import { Link } from '../../../types';

describe('HistoryAdaptedRouter', () => {
    let mockHistory: IHistory4;
    let router: HistoryAdaptedRouter;

    beforeEach(() => {
        mockHistory = {
            location: {
                pathname: '/test',
                search: '?param1=value1&param2=value2',
                hash: '',
                key: 'default',
                state: null,
            },
            push: jest.fn(),
            replace: jest.fn(),
            createHref: jest.fn((link) => {
                let search = '';
                if (link.search) {
                    search = link.search.startsWith('?') ? link.search : `?${link.search}`;
                }

                return `${link.pathname}${search}${link.hash || ''}`;
            }),
            listen: jest.fn(() => jest.fn()),
            block: jest.fn(() => jest.fn()),
        };
        router = new HistoryAdaptedRouter(mockHistory);
    });

    describe('getCurrentLink', () => {
        it('should return current link with parsed query from search', () => {
            const link = router.getCurrentLink();
            expect(link.pathname).toBe('/test');
            expect(link.query).toEqual({
                param1: 'value1',
                param2: 'value2',
            });
        });

        it('should return link with query if query is already present', () => {
            mockHistory.location = {
                pathname: '/test',
                query: { existing: 'query' },
                key: 'default',
                state: null,
            } as Link;
            const link = router.getCurrentLink();
            expect(link.query).toEqual({ existing: 'query' });
        });

        it('should handle empty search string', () => {
            mockHistory.location = {
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
            mockHistory.location = {
                pathname: '/test',
                search: '?obj=%7B%22key%22%3A%22value%22%7D',
                hash: '',
                key: 'default',
                state: null,
            };
            const link = router.getCurrentLink();
            expect(link.query.obj).toEqual({ key: 'value' });
        });
    });

    describe('redirect', () => {
        it('should call history.push with converted link', () => {
            const link: Link = {
                pathname: '/new-path',
                query: { key: 'value' },
            };
            router.redirect(link);
            expect(mockHistory.push).toHaveBeenCalledWith({
                pathname: '/new-path',
                query: { key: 'value' },
                search: 'key=value',
            });
        });

        it('should handle link with search string', () => {
            const link: Link = {
                pathname: '/new-path',
                search: '?existing=search',
            };
            router.redirect(link);
            expect(mockHistory.push).toHaveBeenCalledWith({
                pathname: '/new-path',
                search: '?existing=search',
            });
        });

        it('should handle link without query', () => {
            const link: Link = {
                pathname: '/new-path',
            };
            router.redirect(link);
            expect(mockHistory.push).toHaveBeenCalledWith({
                pathname: '/new-path',
            });
        });

        it('should convert query object to search string', () => {
            const link: Link = {
                pathname: '/new-path',
                query: { param1: 'value1', param2: { nested: 'value' } },
            };
            router.redirect(link);
            const callArgs = (mockHistory.push as jest.Mock).mock.calls[0][0];
            expect(callArgs.pathname).toBe('/new-path');
            expect(callArgs.query).toEqual({ param1: 'value1', param2: { nested: 'value' } });
            expect(callArgs.search).toContain('param1=value1');
            expect(callArgs.search).toContain('param2=%7B%22nested%22%3A%22value%22%7D');
        });
    });

    describe('transfer', () => {
        it('should call history.replace with converted link', () => {
            const link: Link = {
                pathname: '/new-path',
                query: { key: 'value' },
            };
            router.transfer(link);
            expect(mockHistory.replace).toHaveBeenCalledWith({
                pathname: '/new-path',
                query: { key: 'value' },
                search: 'key=value',
            });
        });

        it('should handle link with search string', () => {
            const link: Link = {
                pathname: '/new-path',
                search: '?existing=search',
            };
            router.transfer(link);
            expect(mockHistory.replace).toHaveBeenCalledWith({
                pathname: '/new-path',
                search: '?existing=search',
            });
        });
    });

    describe('isActive', () => {
        it('should return true when pathname matches', () => {
            mockHistory.location = {
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
            mockHistory.location = {
                pathname: '/test',
                search: '',
                hash: '',
                key: 'default',
                state: null,
            };
            const link: Link = { pathname: '/other' };
            expect(router.isActive(link)).toBe(false);
        });

        it('should ignore query params when checking active state', () => {
            mockHistory.location = {
                pathname: '/test',
                search: '?param=value',
                hash: '',
                key: 'default',
                state: null,
            };
            const link: Link = { pathname: '/test', query: { other: 'param' } };
            expect(router.isActive(link)).toBe(true);
        });
    });

    describe('createHref', () => {
        it('should call history.createHref with converted link', () => {
            const link: Link = {
                pathname: '/test',
                query: { key: 'value' },
            };
            router.createHref(link);
            expect(mockHistory.createHref).toHaveBeenCalledWith({
                pathname: '/test',
                query: { key: 'value' },
                search: 'key=value',
            });
        });

        it('should return href string', () => {
            const link: Link = {
                pathname: '/test',
                query: { key: 'value' },
            };
            const href = router.createHref(link);
            expect(href).toBe('/test?key=value');
        });
    });

    describe('listen', () => {
        it('should call history.listen and return unsubscribe function', () => {
            const listener = jest.fn();
            const unsubscribe = jest.fn();
            (mockHistory.listen as jest.Mock).mockReturnValue(unsubscribe);

            const result = router.listen(listener);
            expect(mockHistory.listen).toHaveBeenCalled();
            expect(result).toBe(unsubscribe);
        });
    });

    describe('block', () => {
        it('should call history.block with wrapper function', () => {
            const listener = jest.fn();
            const unsubscribe = jest.fn();
            (mockHistory.block as jest.Mock).mockReturnValue(unsubscribe);

            const result = router.block(listener);
            expect(mockHistory.block).toHaveBeenCalled();
            expect(result).toBe(unsubscribe);

            const blockFn = (mockHistory.block as jest.Mock).mock.calls[0][0];
            const location = { pathname: '/test' };
            blockFn(location);
            expect(listener).toHaveBeenCalledWith(location);
        });

        it('should return unsubscribe function from history.block', () => {
            const listener = jest.fn();
            const unsubscribe = jest.fn();
            (mockHistory.block as jest.Mock).mockReturnValue(unsubscribe);

            const result = router.block(listener);
            expect(result).toBe(unsubscribe);
        });
    });
});
