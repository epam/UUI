import { isClientSide } from '../helpers/ssr';

const AUTH_RECOVERY_STORAGE_ITEM_KEY = 'uui-auth-recovery-success';

export type AuthRecoveryContextProps = {
    apiReloginPath: string;
    onSuccessAuthRecovery: () => void;
};

export class AuthRecoveryService {
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
