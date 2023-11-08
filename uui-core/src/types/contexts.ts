import { AnalyticsEvent, Link } from './objects';
import * as PropTypes from 'prop-types';
import { IModal, INotification } from './props';
import { DndContextState, TMouseCoords } from '../services/dnd/DndContext';
import { Lock } from '../services/LockContext';
import { IHistory4 } from '../services/routing/HistoryAdaptedRouter';
import { NotificationOperation } from '../services/NotificationContext';
import { SkinContext } from '../services/SkinContext';
import { ModalOperation } from '../services/ModalContext';
import { LayoutLayer } from '../services/LayoutContext';

import { FileUploadOptions, FileUploadResponse } from '../services/ApiContext';

export interface IBaseContext<TState = {}> {
    subscribe(handler: (state: TState) => void): void;
    unsubscribe(handler: (state: TState) => void): void;
    destroyContext: () => void;
}

export interface NotificationParams {
    /** Notification visibility duration in ms
     * If 'forever' value provided, notification required manual action for closing.
     */
    duration?: number | 'forever';
    /** Position of notification depends on screen corners */
    position?: 'bot-left' | 'bot-right' | 'top-left' | 'top-right' | 'top-center' | 'bot-center';
}

export interface INotificationContext extends IBaseContext {
    /** Shows provided notification component with defined params  */
    show(render: (props: INotification) => React.ReactNode, notificationParams?: NotificationParams): Promise<void>;
    /** Returns all active notifications */
    getNotifications(): NotificationOperation[];
    /** Removes notification by their id */
    remove(id: number): void;
    /** Removes all active notification */
    clearAll(): void;
}

export interface ILayoutContext {
    /** Returns the new layer. This layer will be higher than previous. */
    getLayer(): LayoutLayer;
    /** Removes provided layer from layers list */
    releaseLayer(layer: LayoutLayer): void;
    /**
     * Returns portal root node.
     * In simple cases it will be node with 'main' or 'root' id or document.body.
     * Or it will return node with portalRootId.
     */
    getPortalRoot(): HTMLElement;
    /**
     * Returns unique id, which can be used as id for portal root.
     * Usually used for cases with shadow DOM, to be able to find this portal root element if it's located under shadow DOM
     */
    getPortalRootId(): string;
}

export interface ILockContext {
    /**
     * Tries to take a lock, and sets tryRelease callback, which will be invoked when something tries to take control over.
     * If a lock already exists, it tries to release the current lock and then set a new one
     */
    acquire(tryRelease: () => Promise<any>): Promise<object>;
    /** Releases lock without calling tryRelease callback */
    release(lock: object): void;
    /** Tries to acquire a lock for the time while the action is being executed. */
    withLock(action: () => Promise<any>): Promise<object>;
    /** Returns currently active lock */
    getCurrentLock: () => Lock | null;
}

export interface IRouterContext {
    /** Returns current location link */
    getCurrentLink(): Link;
    /** Makes a SPA redirect to the provided link */
    redirect(link?: Link | string): void;
    /** Makes a SPA redirect to the provided link. Replaces the current entry in the history stack with a new one */
    transfer(link: Link): void;
    /** Returns true, if provided link match current location */
    isActive(link: Link): boolean;
    /** Creates href string based on provided link */
    createHref(link: Link): string;
    /** Subscribes to the router updates */
    listen(listener: (link: Link) => void): () => void;
    /**
     * Blocks router changes. Can be used to show confirmation dialogs before the redirect.
     * If block callback provide, all router changes will be blocked, you need to unblock and to retry them by yourself.
     * */
    block(callback: (link: Link) => void): () => void;
}

export interface IModalContext extends IBaseContext {
    /** Shows provided modal component with defined params  */
    show<TResult, TParameters = {}>(render: (props: IModal<TResult>) => React.ReactNode, parameters?: TParameters): Promise<TResult>;
    /** Removes all active modals */
    closeAll(): void;
    /** Returns true, if some modal displayed */
    isModalOperationActive(): boolean;
    /** Returns all active modals */
    getOperations(): ModalOperation[];
}

export interface IDndContext extends IBaseContext<DndContextState> {
    startDrag(node: Node, data: any, renderGhost: () => React.ReactNode): void;
    endDrag(): void;
    /** Indicates that drag in progress */
    isDragging: boolean;
    dragData?: any;
    getMouseCoords: () => TMouseCoords
}

/** Save data to the localStorage */
export interface IUserSettingsContext {
    /** Gets value by key from localStorage */
    get<TValue>(key: any, initial?: TValue): TValue;
    /** Sets value by key from localStorage */
    set<TValue>(key: any, value: TValue): void;
}

export interface IErrorContext extends IBaseContext {
    /** Current error */
    currentError?: Error;
    /** Reports error to context */
    reportError(error: Error): void;
    /** Sets an error handler callback */
    onError(callback: Function): void;
    /** Discard current error */
    discardError(): void;
    /** Discard errors and refresh app */
    recover(): void;
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
    /** Native fetch method options  */
    fetchOptions?: RequestInit;
    /** Defines how to handle request errors:
     * 'page' - displays an error splash screen.
     * 'notification' - shows the error using a notification card without blocking the application.
     * 'manual' - means the API context won't handle the error; you should manage it yourself.
     */
    errorHandling?: 'manual' | 'page' | 'notification';
}

export interface IApiContext extends IBaseContext {
    /** Current status of api service.
     * idle - service do nothing and ready to process new requests
     * running - service is currently processing requests
     * error - service received an error and stop processing requests, due to this error will be discarded
     * recovery - service trying to restore connection and recover latest requests
     * */
    readonly status: ApiStatus;
    readonly recoveryReason: ApiRecoveryReason | null;
    /** Returns currently processing or failed requests */
    getActiveCalls(status?: ApiCallStatus): ApiCallInfo[];
    /** Resets all errors */
    reset(): void;
    /** Starts fetch call with providing params */
    processRequest(url: string, method: string, data?: any, options?: ApiCallOptions): Promise<any>;
    /** Starts file uploading using FormData */
    uploadFile(url: string, file: File, options: FileUploadOptions): Promise<FileUploadResponse>;
}

export interface IAnalyticsContext {
    /** Sends event to the all listeners */
    sendEvent(event?: AnalyticsEvent): void;
    /** Adds analytic event listener */
    addListener(listener: IAnalyticsListener): void;
}

export interface IAnalyticsListener {
    /** Defines how to send event to the analytics system */
    sendEvent(event: AnalyticsEvent, parameters: Omit<AnalyticsEvent, 'name'>, eventType?: 'event' | 'pageView' | 'apiTiming'): void;
}

export interface ApiExtensions<TApi> {
    withOptions(options: ApiCallOptions): TApi;
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

export interface CommonContexts<TApi, TAppContext> extends UuiContexts {
    api: TApi & ApiExtensions<TApi>;
    uuiApp: TAppContext;
    history?: IHistory4;
}

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
