import { BaseContext } from './BaseContext';
import { AnalyticsContext } from './AnalyticsContext';
import {
    IApiContext, ApiStatus, ApiRecoveryReason, ApiCallInfo, IProcessRequest,
} from '../types';
import { isClientSide } from '../helpers/ssr';
import { getCookie } from '../helpers/cookie';

interface ApiCall extends ApiCallInfo {
    /** Request promise resolve callback */
    resolve: (value?: any) => any;
    /** Request promise reject callback */
    reject: (value?: any) => any;
}

export class ApiCallError extends Error {
    constructor(public call: ApiCall) {
        super('ApiContext: API call failed');
    }
}

export interface FileUploadOptions {
    /** Called during the file uploading, used to track upload progress */
    onProgress?: (progress: number) => any;
    /** Callback to receive the instance of xhr. Can be used to abort the request. */
    getXHR?: (xhr: XMLHttpRequest) => any;
}

export interface FileUploadResponse {
    /** ID of the file */
    id: number;
    /** Name of the file */
    name: string;
    /** File size */
    size: number;
    /** Path to the file source */
    path?: string;
    /** Type of file representation. Used for UUI SlateRTE file displaying. */
    type?: BlockTypes;
    /** Extension of the file */
    extension?: string;
    /** Upload error  */
    error?: {
        /** If true, indicates about error while file uploading */
        isError: boolean;
        /** Error message */
        message?: string;
    };
}

export type BlockTypes = 'attachment' | 'iframe' | 'image';
export interface ApiContextProps {
    /** Url to the relogin page. Used to open new browser window by this path, in case of auth lost error.
     * Opened by this path page, should process authentication and then post 'authSuccess' cross-window message to the opener, to recover failed requests.
     * @default '/auth/login'
     * */
    apiReloginPath?: string;
    /** Url to the api, which ApiContext will start pinging in case of 'connection lost', until it gets 200 status. Then it will retry failed requests.
     * @default '/auth/ping'
     * */
    apiPingPath?: string;
    /** Url to the server api under which all requests will be processed. Usefully for cases, when all api located by some specific url, which is not much app url.
     * @default ''
     * */
    apiServerUrl?: string;

    /**
     * Allows to replace fetch implementation, for adding auth headers, mocking for testing, etc.
     * By default, standard fetch will be used.
     */
    fetch?: typeof fetch;
}

export class ApiContext extends BaseContext implements IApiContext {
    private queue: ApiCall[] = [];
    private isRunScheduled = false;
    public status: ApiStatus = 'idle';
    public recoveryReason: ApiRecoveryReason | null = null;
    public apiReloginPath: string;
    constructor(private props: ApiContextProps, private analyticsCtx?: AnalyticsContext) {
        super();
        this.apiReloginPath = this.props.apiReloginPath ?? '/auth/login';
        this.props.apiPingPath = this.props.apiPingPath ?? '/auth/ping';
        this.props.apiServerUrl = this.props.apiServerUrl ?? '';
    }

    init() {
        super.init();

        if (isClientSide) {
            // If we opened another window to relogin and check auth - close this window and resume
            window.addEventListener('message', this.handleWindowMessage);
            window.addEventListener('storage', this.handleStorageUpdate);
        }
    }

    private handleWindowMessage = (e: MessageEvent) => {
        if (e.data === 'authSuccess') {
            this.handleSuccessAuthRecovery();
            (e.source as any).close();
        }
    };

    private handleStorageUpdate = () => {
        const isRecoverySuccess = window.localStorage.getItem('uui-auth-recovery-success');
        if (isRecoverySuccess === 'true') {
            this.handleSuccessAuthRecovery();
            window.localStorage.removeItem('uui-auth-recovery-success');
        }
    };

    private handleSuccessAuthRecovery = () => {
        if (this.status === 'recovery' && this.recoveryReason === 'auth-lost') {
            this.setStatus('running');
            this.runQueue();
            this.update({});
        }
    };

    public destroyContext() {
        super.destroyContext();
        if (isClientSide) {
            window.removeEventListener('message', this.handleWindowMessage);
        }
    }

    public getActiveCalls(): ApiCallInfo[] {
        return this.queue;
    }

    public reset() {
        if (this.status === 'error' || this.status === 'recovery') {
            this.queue = [];
            this.status = 'running';
        }
    }

    private setStatus(status: ApiStatus, recoveryReason: ApiRecoveryReason = null) {
        this.status = status;
        this.recoveryReason = recoveryReason;
        this.update({});
    }

    private handleApiError(call: ApiCall, reason?: ApiRecoveryReason) {
        const error = new ApiCallError(call);

        if (call.options?.errorHandling === 'manual' && !(reason === 'auth-lost' || reason === 'connection-lost')) {
            this.removeFromQueue(call);
            call.reject(error);
            return;
        }

        if (reason) {
            call.status = 'scheduled';
            if (this.status === 'recovery') {
                return;
            }
            this.setStatus('recovery', reason);
            if (reason === 'auth-lost') {
                window.open(this.apiReloginPath);
            } else {
                this.recoverConnection();
            }
        } else {
            call.status = 'error';
            this.setStatus('error');
            call.reject(error);
        }
    }

    private startCall(call: ApiCall) {
        const fetchOptions = call.options?.fetchOptions;

        const headers = new Headers(fetchOptions?.headers);

        if (!headers.has('Content-Type')) {
            headers.append('Content-Type', 'application/json');
        }

        const csrfCookie = isClientSide && getCookie('CSRF-TOKEN');

        if (csrfCookie) {
            headers.append('X-CSRF-Token', csrfCookie);
        }

        call.attemptsCount += 1;
        call.status = 'running';
        call.startedAt = new Date();

        const fetcher = this.props.fetch || fetch;

        fetcher(
            this.props.apiServerUrl + call.url,
            {
                method: call.method,
                body: call.requestData && JSON.stringify(call.requestData),
                credentials: 'include',
                ...fetchOptions,
                headers,
            },
        )
            .then((response) => {
                this.handleResponse(call, response);
            })
            .catch((e: Error) => {
                if (e?.name === 'AbortError') {
                    this.removeFromQueue(call);
                    return;
                }
                if (call.attemptsCount < 2) {
                    this.handleApiError(call, 'connection-lost');
                } else {
                    this.handleApiError(call);
                }
            });
    }

    private handleResponse(call: ApiCall, response: Response) {
        call.finishedAt = new Date();
        call.httpStatus = response.status;
        if (response.ok) {
            this.analyticsCtx?.sendEvent(
                {
                    name: 'timing_complete',
                    parameters: {
                        value: call.finishedAt.getTime() - call.startedAt.getTime(),
                        name: call.name,
                        event_category: window.location.pathname,
                    },
                },
                'apiTiming',
            );

            if (response.status === 204) {
                return this.resolveCall(call, null);
            }

            call.options.parseResponse(response)
                .then((result) => {
                    call.responseData = result;
                    this.resolveCall(call, result);
                })
                .catch((e) => {
                    if (e?.name === 'AbortError') {
                        this.removeFromQueue(call);
                        return;
                    }

                    /* Problem with response JSON parsing */
                    call.status = 'error';
                    this.setStatus('error');
                    call.reject(e);
                });
        } else if (
            /* Network and server-related problems. We'll ping the server and then retry the call in this case. */
            (response.status === 408
                || /* Request Timeout */ response.status === 420
                || /* Enhance Your Calm */ response.status === 429
                || /* Too Many Requests */ response.status === 502
                || /* Bad Gateway */ response.status === 503
                || /* Service Unavailable */ response.status === 504)
            && /* Gateway Timeout */ call.attemptsCount < 2 /*
                    There can be cases, when server returns some of these states, while /ping works.
                    To not enter infinite loop in this case, we limit number of retries.
                */
        ) {
            let reason: ApiRecoveryReason = 'connection-lost';
            if (response.status === 420 || response.status === 429) {
                reason = 'server-overload';
            }
            if (response.status === 503) {
                reason = 'maintenance';
            }

            this.handleApiError(call, reason);
        } else if (response.status === 401) {
            /* Authentication cookies invalidated */ this.handleApiError(call, 'auth-lost');
        } else {
            // Try to parse response
            call.options.parseResponse(response)
                .catch(() => null) // Ignore parsing errors
                .then((result) => {
                    call.responseData = result;
                    this.handleApiError(call);
                });
        }
    }

    private removeFromQueue(call: ApiCall) {
        this.queue = this.queue.filter((c) => c !== call);
        if (this.status === 'error' && !this.queue.some((c) => c.status === 'error')) {
            this.setStatus('idle');
            this.runQueue();
        }
    }

    private resolveCall(call: ApiCall, result: any) {
        this.removeFromQueue(call);
        call.resolve(result);
    }

    private runQueue() {
        this.isRunScheduled = false;
        if (this.status === 'idle' || this.status === 'running') {
            this.queue.filter((c) => c.status === 'scheduled').forEach((c) => this.startCall(c));
        }
    }

    private recoverConnection() {
        const retry = () => setTimeout(() => this.recoverConnection(), 2000);
        const fetcher = this.props.fetch || fetch;
        fetcher(this.props.apiPingPath, {
            method: 'GET',
            credentials: 'include',
        })
            .then((response) => {
                if (response.ok) {
                    this.setStatus('running');
                    this.runQueue();
                    this.update({});
                } else {
                    retry();
                }
            })
            .catch(retry);
    }

    private scheduleRun() {
        if (!this.isRunScheduled) {
            setTimeout(() => this.runQueue(), 0);
            this.isRunScheduled = false;
        }
    }

    private defaultParseResponse = (res: Response) => {
        return res.json();
    };

    public processRequest: IProcessRequest = (url, method, data, options) => {
        let name = url;
        if (data && data.operationName) {
            name += ' ' + data.operationName;
        }

        options = {
            errorHandling: 'page',
            parseResponse: this.defaultParseResponse,
            ...options,
        };

        return new Promise((resolve, reject) => {
            const call: ApiCall = {
                name,
                url,
                method,
                requestData: data,
                options,
                resolve,
                reject,
                status: 'scheduled',
                attemptsCount: 0,
                dismissError: () => {
                    this.removeFromQueue(call);
                    this.update({});
                },
            };
            this.queue.push(call);
            this.scheduleRun();
        });
    };

    public uploadFile(url: string, file: File, options?: FileUploadOptions) {
        const trackProgress = (event: any) => {
            const progress = +((event.loaded / event.total) * 100).toFixed(2);
            options.onProgress && options.onProgress(progress);
        };

        return new Promise<FileUploadResponse>((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', file);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);

            const csrfCookie = getCookie('CSRF-TOKEN');
            if (csrfCookie) {
                xhr.setRequestHeader('X-CSRF-Token', csrfCookie);
            }

            xhr.withCredentials = true;

            const removeAllListeners = () => {
                xhr.upload.removeEventListener('progress', trackProgress);
                xhr.removeEventListener('abort', removeAllListeners);
            };

            if (options.onProgress) {
                xhr.upload.addEventListener('progress', trackProgress, false);
            }

            if (options.getXHR) {
                xhr.addEventListener('abort', removeAllListeners, false);
                options.getXHR(xhr);
            }

            xhr.onreadystatechange = () => {
                if (xhr.readyState !== 4) return;
                let response;
                try {
                    response = JSON.parse(xhr.response);
                } catch {
                    reject({ error: { isError: true, message: 'File upload error' } });
                }
                if (!new RegExp('^2[0-9][0-9]').test(xhr.status.toString())) {
                    reject({ error: { isError: true, message: response?.error?.message } });
                }

                removeAllListeners();
                resolve(response);
            };
            xhr.send(formData);
        });
    }
}
