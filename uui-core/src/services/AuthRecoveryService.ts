import { isClientSide } from '../helpers/ssr';

const AUTH_RECOVERY_STORAGE_ITEM_KEY = 'uui-auth-recovery-success';

/** Props passed to the authentication recovery service constructor. */
export type AuthRecoveryContextProps = {
    /** Url to the relogin page. Used to open a new browser window when auth is lost. */
    apiReloginPath: string;
    /** Called when authentication has been successfully recovered, so ApiContext can retry failed requests. */
    onSuccessAuthRecovery: () => void;
};

/** Service that recovers from lost authentication (e.g. opens a relogin popup and notifies ApiContext on success). */
export interface IAuthRecoveryService {
    /** Subscribes to recovery signals (e.g. storage events). Called when ApiContext initializes. */
    init?(): void;
    /** Unsubscribes from recovery signals. Called when ApiContext is destroyed. */
    destroy?(): void;
    /** Starts the authentication recovery flow (e.g. opens the relogin page in a new tab). */
    tryToRecover(): void;
}

export class AuthRecoveryService implements IAuthRecoveryService {
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
