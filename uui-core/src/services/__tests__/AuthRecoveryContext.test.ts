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

    it('should register both "message" and "storage" event listeners when messageChannel is not specified', () => {
        const onSuccessAuthRecovery = jest.fn();
        jest.spyOn(window, 'addEventListener');
        jest.spyOn(window, 'removeEventListener');

        const context = new AuthRecoveryContext({
            apiReloginPath,
            onSuccessAuthRecovery,
            messageChannel: undefined,
        });
        context.init();

        expect(window.addEventListener).toHaveBeenCalledWith('message', expect.any(Function));
        expect(window.addEventListener).toHaveBeenCalledWith('storage', expect.any(Function));

        context.destroy();

        expect(window.removeEventListener).toHaveBeenCalledWith('message', expect.any(Function));
        expect(window.removeEventListener).toHaveBeenCalledWith('storage', expect.any(Function));
    });

    it('should register only "message" event listener when messageChannel is "postMessage"', () => {
        const onSuccessAuthRecovery = jest.fn();
        jest.spyOn(window, 'addEventListener');
        jest.spyOn(window, 'removeEventListener');

        const context = new AuthRecoveryContext({
            apiReloginPath,
            onSuccessAuthRecovery,
            messageChannel: 'postMessage',
        });
        context.init();

        expect(window.addEventListener).toHaveBeenCalledWith('message', expect.any(Function));
        expect(window.addEventListener).not.toHaveBeenCalledWith('storage', expect.any(Function));
    });

    it('should register only "storage" event listener when messageChannel is "localStorageMessage"', () => {
        const onSuccessAuthRecovery = jest.fn();
        jest.spyOn(window, 'addEventListener');
        jest.spyOn(window, 'removeEventListener');

        const context = new AuthRecoveryContext({
            apiReloginPath,
            onSuccessAuthRecovery,
            messageChannel: 'localStorageMessage',
        });
        context.init();

        expect(window.addEventListener).not.toHaveBeenCalledWith('message', expect.any(Function));
        expect(window.addEventListener).toHaveBeenCalledWith('storage', expect.any(Function));
    });

    it('should open apiReloginPath in a new tab with features for "localStorageMessage"', () => {
        const onSuccessAuthRecovery = jest.fn();
        jest.spyOn(window, 'addEventListener');
        jest.spyOn(window, 'removeEventListener');

        const context = new AuthRecoveryContext({
            apiReloginPath,
            onSuccessAuthRecovery,
            messageChannel: 'localStorageMessage',
        });
        context.init();
        context.tryToRecover();

        expect(window.open).toHaveBeenCalledWith(
            apiReloginPath,
            '_blank',
            'noopener,noreferrer',
        );
    });

    it('should open apiReloginPath in a new tab without features for "postMessage"', () => {
        const onSuccessAuthRecovery = jest.fn();
        jest.spyOn(window, 'addEventListener');
        jest.spyOn(window, 'removeEventListener');

        const context = new AuthRecoveryContext({
            apiReloginPath,
            onSuccessAuthRecovery,
            messageChannel: 'postMessage',
        });
        context.init();
        context.tryToRecover();

        expect(window.open).toHaveBeenCalledWith(apiReloginPath);
    });
});
