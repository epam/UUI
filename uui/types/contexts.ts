import { Link, LayoutLayer } from './objects';
import * as PropTypes from 'prop-types';
import { IModal, INotification } from './props';
import { FileUploadOptions, FileUploadResponse, SkinContext, ModalOperation, NotificationOperation, IHistory4 } from "../services";

export interface IBaseContext<TState = {}> {
    subscribe(handler: (state: TState) => void): void;
    unsubscribe(handler: (state: TState) => void): void;
}

export interface NotificationParams {
    duration?: number | 'forever';
    position?: 'bot-left' | 'bot-right' | 'top-left' | 'top-right' | 'top-center' | 'bot-center';
}

export interface INotificationContext extends IBaseContext {
    show(render: (props: INotification) => React.ReactNode, notificationParams?: NotificationParams): Promise<void>;
    getNotifications(): NotificationOperation[];
    remove(id: number): void;
    clearAll(): void;
}

export interface ILayoutContext {
    getLayer(): LayoutLayer;
    releaseLayer(layer: LayoutLayer): void;
}

export interface ILockContext  {
    acquire(tryRelease: () => Promise<any>): Promise<object>;
    release(lock: object): void;
    withLock(action: () => Promise<any>): Promise<object>;
}

export interface IRouterContext {
    getCurrentLink(): Link;
    redirect(link?: Link | string): void;
    transfer(link: Link): void;
    isActive(link: Link): boolean;
    createHref(link: Link): string;
    listen(listener: (link: Link) => void): () => void;
    block(callback: (link: Link) => void): () => void;
}

export interface IModalContext {
    show<TResult, TParameters = {}>(render: (props: IModal<TResult>) => React.ReactNode, parameters?: TParameters): Promise<TResult>;
    closeAll(): void;
    isModalOperationActive(): boolean;
    getOperations(): ModalOperation[];
}


export interface DndContextState {
    isDragging: boolean;
    ghostOffsetX?: number;
    ghostOffsetY?: number;
    ghostWidth?: number;
    renderGhost?(): React.ReactNode;
}

export interface IDndContext extends IBaseContext<DndContextState> {
    startDrag(node: Node, data: any, renderGhost: () => React.ReactNode): void;
    endDrag(): void;
    isDragging: boolean;
    dragData?: any;
}

export interface IUserSettingsContext {
    get<TValue>(key: any, initial?: TValue): TValue;
    set<TValue>(key: any, value: TValue): void;
}


export interface UuiErrorInfo {
    status?: number;
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    imageUrl?: string;
}

export class UuiError extends Error {
    constructor(public info: UuiErrorInfo) {
        super(`UUI Error`);
        this.name = "UuiError";
        // Set the prototype explicitly.
        // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, UuiError.prototype);
    }
}

export interface IErrorContext {
    currentError?: Error;
    reportError(error: Error): void;
    onError(callback: Function): void;
}

export type ApiStatus = 'idle' | 'running' | 'error' | 'recovery';
export type ApiRecoveryReason = 'auth-lost' | 'connection-lost' | 'server-overload' | 'maintenance' | null;

type ApiCallStatus = 'scheduled' | 'running' | 'error';

export interface ApiCallInfo {
    url: string;
    name: string;
    method: string;
    requestData: {};
    options?: ApiCallOptions;
    status: ApiCallStatus;
    httpStatus?: number;
    responseData?: {
        errorMessage?: string;
    };
    errorStatus?: number;
    startedAt?: Date;
    finishedAt?: Date;
    attemptsCount: number;
    dismissError(): void;
}

export interface ApiCallOptions {
    fetchOptions?: RequestInit;
    errorHandling?: 'manual' | 'page' | 'notification';
}

export interface IApiContext extends IBaseContext {
    readonly status: ApiStatus;
    readonly recoveryReason: ApiRecoveryReason | null;
    getActiveCalls(status?: ApiCallStatus): ApiCallInfo[];
    reset(): void;
    processRequest(url: string, method: string, data?: any, options?: ApiCallOptions): Promise<any>;
    uploadFile(url: string, file: File, options: FileUploadOptions): Promise<FileUploadResponse>;
}

export interface IAnalyticsContext {
    sendEvent(event?: AnalyticsEvent): void;
    sendPageView(path: string): void;
}

export interface UuiContexts {
    uuiApi: IApiContext;
    uuiRouter: IRouterContext;
    uuiModals: IModalContext;
    uuiDnD: IDndContext;
    uuiUserSettings: IUserSettingsContext;
    uuiAnalytics: IAnalyticsContext;
    uuiErrors: IErrorContext;
    uuiNotifications: INotificationContext;
    uuiLayout: ILayoutContext;
    uuiLocks: ILockContext;
    uuiSkin: SkinContext;
}

export interface ApiExtensions<TApi> {
    withOptions(options: ApiCallOptions): TApi;
}

export interface CommonContexts<TApi, TAppContext> extends UuiContexts {
    api: TApi & ApiExtensions<TApi>;
    uuiApp: TAppContext;
    history: IHistory4;
}

export type AnalyticsEvent = {
    name: string;
    [key: string]: any;
} | null;

export const uuiContextTypes = {
    uuiAnalytics: PropTypes.object,
    uuiErrors: PropTypes.object,
    uuiApi: PropTypes.object,
    uuiModals: PropTypes.object,
    uuiNotifications: PropTypes.object,
    api: PropTypes.object,
    uuiUserSettings: PropTypes.object,
    uuiDnD: PropTypes.object,
    uuiApp: PropTypes.object,
    uuiRouter: PropTypes.object,
    uuiLayout: PropTypes.object,
    uuiLocks: PropTypes.object,
    history: PropTypes.object,
    uuiSkin: PropTypes.object,
};