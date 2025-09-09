/*
 * Copyright © 2025 EPAM Systems, Inc. All Rights Reserved. All information contained herein is, and remains the
 * property of EPAM Systems, Inc. and/or its suppliers and is protected by international intellectual
 * property law. Dissemination of this information or reproduction of this material is strictly forbidden,
 * unless prior written permission is obtained from EPAM Systems, Inc
 */

import { isClientSide } from '../helpers/ssr';

const AUTH_RECOVERY_STORAGE_ITEM_KEY = 'uui-auth-recovery-success';

export type AuthRecoveryContextProps = {
    apiReloginPath: string;
    onSuccessAuthRecovery: () => void;
};

export class AuthRecoveryContext {
    constructor(private props: AuthRecoveryContextProps) {}

    init = () => {
        if (isClientSide) {
            window.addEventListener('storage', this.handleStorageUpdate);
        }
    };

    destroy = () => {
        if (isClientSide) {
            window.removeEventListener('storage', this.handleStorageUpdate);
        }
    };

    tryToRecover = () => {
        // The auth cannot recover when the Access session has expired and "opener" is present. So we erase opener here.
        window.open(this.props.apiReloginPath, '_blank', 'noopener,noreferrer');
    };

    private handleStorageUpdate = (e: StorageEvent) => {
        if (e.key === AUTH_RECOVERY_STORAGE_ITEM_KEY && e.newValue === 'true') {
            this.props.onSuccessAuthRecovery();
            window.localStorage.removeItem(AUTH_RECOVERY_STORAGE_ITEM_KEY);
        }
    };
}
