/*
 * Copyright © 2025 EPAM Systems, Inc. All Rights Reserved. All information contained herein is, and remains the
 * property of EPAM Systems, Inc. and/or its suppliers and is protected by international intellectual
 * property law. Dissemination of this information or reproduction of this material is strictly forbidden,
 * unless prior written permission is obtained from EPAM Systems, Inc
 */

import { isClientSide } from '../helpers/ssr';

export type AuthRecoveryContextProps = {
    apiReloginPath: string;
    onSuccessAuthRecovery: () => void;
    /**
     * Note: 'postMessage' is used by default, but 'localStorageMessage' is preferred.
     * It must be synchronized with the implementation of the HTML page returned by 'apiReloginPath'.
     */
    messageChannel?: 'localStorageMessage' | 'postMessage';
};

export class AuthRecoveryContext {
    constructor(private props: AuthRecoveryContextProps) {}

    init = () => {
        if (isClientSide) {
            const { messageChannel } = this.props;
            if (!messageChannel || messageChannel === 'postMessage') {
                window.addEventListener('message', this.handleWindowMessage);
            }
            if (!messageChannel || messageChannel === 'localStorageMessage') {
                window.addEventListener('storage', this.handleStorageUpdate);
            }
        }
    };

    destroy = () => {
        if (isClientSide) {
            window.removeEventListener('message', this.handleWindowMessage);
            window.removeEventListener('storage', this.handleStorageUpdate);
        }
    };

    tryToRecover = () => {
        // The auth cannot recover when the Access session has expired and "opener" is present. But we can only omit the opener for 'localStorageMessage' case.
        if (this.props.messageChannel === 'localStorageMessage') {
            window.open(this.props.apiReloginPath, '_blank', 'noopener,noreferrer');
        } else {
            window.open(this.props.apiReloginPath);
        }
    };

    private handleWindowMessage = (e: MessageEvent) => {
        if (e.data === 'authSuccess') {
            this.props.onSuccessAuthRecovery();
            (e.source as any).close();
        }
    };

    private handleStorageUpdate = () => {
        const isRecoverySuccess = window.localStorage.getItem('uui-auth-recovery-success');
        if (isRecoverySuccess === 'true') {
            this.props.onSuccessAuthRecovery();
            window.localStorage.removeItem('uui-auth-recovery-success');
        }
    };
}
