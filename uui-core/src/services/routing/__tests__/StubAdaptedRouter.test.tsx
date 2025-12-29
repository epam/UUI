import { StubAdaptedRouter } from '../StubAdaptedRouter';

describe('StubAdaptedRouter', () => {
    let router: StubAdaptedRouter;
    let consoleErrorSpy: jest.SpyInstance;
    const originalEnv = process.env.NODE_ENV;

    beforeEach(() => {
        router = new StubAdaptedRouter();
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
        process.env.NODE_ENV = originalEnv;
    });

    describe('getCurrentLink', () => {
        it('should return default link in test environment', () => {
            process.env.NODE_ENV = 'test';
            const link = router.getCurrentLink();
            expect(link).toEqual({ pathname: '', query: {} });
            expect(consoleErrorSpy).not.toHaveBeenCalled();
        });

        it('should return null in non-test environment', () => {
            process.env.NODE_ENV = 'production';
            const link = router.getCurrentLink();
            expect(link).toBeNull();
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Warning: [RouterContext] there is not Router Adapter provided. StubAdapter is used',
            );
        });

        it('should log error in development environment', () => {
            process.env.NODE_ENV = 'development';
            router.getCurrentLink();
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Warning: [RouterContext] there is not Router Adapter provided. StubAdapter is used',
            );
        });
    });

    describe('redirect', () => {
        it('should not log error in test environment', () => {
            process.env.NODE_ENV = 'test';
            router.redirect();
            expect(consoleErrorSpy).not.toHaveBeenCalled();
        });

        it('should log error in non-test environment', () => {
            process.env.NODE_ENV = 'production';
            router.redirect();
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Warning: [RouterContext] there is not Router Adapter provided. StubAdapter is used',
            );
        });
    });

    describe('transfer', () => {
        it('should not log error in test environment', () => {
            process.env.NODE_ENV = 'test';
            router.transfer();
            expect(consoleErrorSpy).not.toHaveBeenCalled();
        });

        it('should log error in non-test environment', () => {
            process.env.NODE_ENV = 'production';
            router.transfer();
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Warning: [RouterContext] there is not Router Adapter provided. StubAdapter is used',
            );
        });
    });

    describe('isActive', () => {
        it('should return false', () => {
            process.env.NODE_ENV = 'test';
            const result = router.isActive();
            expect(result).toBe(false);
        });

        it('should log error in non-test environment', () => {
            process.env.NODE_ENV = 'production';
            router.isActive();
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Warning: [RouterContext] there is not Router Adapter provided. StubAdapter is used',
            );
        });
    });

    describe('createHref', () => {
        it('should return empty string', () => {
            process.env.NODE_ENV = 'test';
            const href = router.createHref();
            expect(href).toBe('');
        });

        it('should log error in non-test environment', () => {
            process.env.NODE_ENV = 'production';
            router.createHref();
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Warning: [RouterContext] there is not Router Adapter provided. StubAdapter is used',
            );
        });
    });

    describe('listen', () => {
        it('should return no-op unsubscribe function', () => {
            process.env.NODE_ENV = 'test';
            const unsubscribe = router.listen();
            expect(typeof unsubscribe).toBe('function');
            expect(() => unsubscribe()).not.toThrow();
        });

        it('should log error in non-test environment', () => {
            process.env.NODE_ENV = 'production';
            router.listen();
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Warning: [RouterContext] there is not Router Adapter provided. StubAdapter is used',
            );
        });
    });

    describe('block', () => {
        it('should return no-op unsubscribe function', () => {
            process.env.NODE_ENV = 'test';
            const unsubscribe = router.block();
            expect(typeof unsubscribe).toBe('function');
            expect(() => unsubscribe()).not.toThrow();
        });

        it('should log error in non-test environment', () => {
            process.env.NODE_ENV = 'production';
            router.block();
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Warning: [RouterContext] there is not Router Adapter provided. StubAdapter is used',
            );
        });
    });

    describe('throwError', () => {
        it('should not throw error in test environment', () => {
            process.env.NODE_ENV = 'test';
            expect(() => router['throwError']()).not.toThrow();
            expect(consoleErrorSpy).not.toHaveBeenCalled();
        });

        it('should log error in non-test environment', () => {
            process.env.NODE_ENV = 'production';
            router['throwError']();
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Warning: [RouterContext] there is not Router Adapter provided. StubAdapter is used',
            );
        });
    });
});
