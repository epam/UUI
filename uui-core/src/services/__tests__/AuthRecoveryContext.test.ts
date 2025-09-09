/*
 * Copyright © 2025 EPAM Systems, Inc. All Rights Reserved. All information contained herein is, and remains the
 * property of EPAM Systems, Inc. and/or its suppliers and is protected by international intellectual
 * property law. Dissemination of this information or reproduction of this material is strictly forbidden,
 * unless prior written permission is obtained from EPAM Systems, Inc
 */

import { AuthRecoveryContext } from './../AuthRecoveryContext';

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

        const context = new AuthRecoveryContext({
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

        const context = new AuthRecoveryContext({
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

        const context = new AuthRecoveryContext({
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
