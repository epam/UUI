import { AuthRecoveryService } from '../AuthRecoveryService';

const apiReloginPath = '/test';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
jest.spyOn(window, 'open').mockImplementation((url?: string | URL, target?: string, features?: string) => window);

describe('AuthRecoveryContext', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should register "storage" event listeners', () => {
        const onSuccessAuthRecovery = jest.fn();
        jest.spyOn(window, 'addEventListener');
        jest.spyOn(window, 'removeEventListener');

        const context = new AuthRecoveryService({
            apiReloginPath,
            onSuccessAuthRecovery,
        });
        context.init();

        expect(window.addEventListener).toHaveBeenCalledWith('storage', expect.any(Function));

        context.destroy();

        expect(window.removeEventListener).toHaveBeenCalledWith('storage', expect.any(Function));
    });

    it('should open apiReloginPath in a new tab without opener', () => {
        const onSuccessAuthRecovery = jest.fn();
        jest.spyOn(window, 'addEventListener');

        const context = new AuthRecoveryService({
            apiReloginPath,
            onSuccessAuthRecovery,
        });
        context.init();
        context.tryToRecover();

        expect(window.open).toHaveBeenCalledWith(
            apiReloginPath,
            '_blank',
            'noopener,noreferrer',
        );
    });

    it('should invoke onSuccessAuthRecovery when signal received', () => {
        const onSuccessAuthRecovery = jest.fn();
        jest.spyOn(window, 'addEventListener');

        const context = new AuthRecoveryService({
            apiReloginPath,
            onSuccessAuthRecovery,
        });
        context.init();
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'uui-auth-recovery-success',
            newValue: 'true',
            oldValue: '',
            storageArea: localStorage,
        }));

        expect(onSuccessAuthRecovery).toHaveBeenCalled();
    });
});
