import { BaseContext } from './BaseContext';
import { AnalyticsContext } from './AnalyticsContext';
import {
    IApiContext, ApiStatus, ApiRecoveryReason, ApiCallOptions, ApiCallInfo,
} from '../types';
import { getCookie, isClientSide } from '../helpers';
import { ApiContextProps } from './ContextProvider';

interface ApiCall extends ApiCallInfo {
    resolve: (value?: any) => any;
    reject: (value?: any) => any;
}

export class ApiCallError extends Error {
    constructor(public call: ApiCall) {
        super('ApiContext: XHR call failed');
    }
}

export interface FileUploadOptions {
    onProgress?: (progress: number) => any;
    getXHR?: (xhr: XMLHttpRequest) => any; // get xhr to be able to cancel the request
}

export interface FileUploadResponse {
    id: number;
    name: string;
    size: number;
    path?: string;
    type?: BlockTypes;
    extension?: string;
    error?: {
        isError: boolean;
        message?: string;
    };
}

export type IProcessRequest = (url: string, method: string, data?: any, options?: ApiCallOptions) => Promise<any>;

export type BlockTypes = 'attachment' | 'iframe' | 'image';

export class ApiContext extends BaseContext implements IApiContext {
    private queue: ApiCall[] = [];
    private isRunScheduled = false;
    public status: ApiStatus = 'idle';
    public recoveryReason: ApiRecoveryReason | null = null;
    constructor(private props: ApiContextProps, private analyticsCtx?: AnalyticsContext) {
        super();
        this.props.apiReloginPath = this.props.apiReloginPath ?? '/auth/login';
        this.props.apiPingPath = this.props.apiPingPath ?? '/auth/ping';
        this.props.apiServerUrl = this.props.apiServerUrl ?? '';
        isClientSide && this.runListeners();
    }

    private runListeners() {
        // If we opened another window to relogin and check auth - close this window and resume
        window.addEventListener('message', (e) => {
            if (e.data == 'authSuccess') {
                if (this.status === 'recovery' && this.recoveryReason === 'auth-lost') {
                    this.setStatus('running');
                    this.runQueue();
                    this.update({});
                }
                (e.source as any).close();
            }
        });
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

        if (call.options?.errorHandling === 'manual') {
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
            reason === 'auth-lost' ? window.open(this.props.apiReloginPath) : this.recoverConnection();
        } else {
            call.status = 'error';
            this.setStatus('error');
            call.reject(error);
        }
    }

    private startCall(call: ApiCall) {
        const headers = new Headers();
        const csrfCookie = isClientSide && getCookie('CSRF-TOKEN');
        headers.append('Content-Type', 'application/json');
        if (csrfCookie) {
            headers.append('X-CSRF-Token', csrfCookie);
        }
        call.attemptsCount += 1;
        call.status = 'running';
        call.startedAt = new Date();
        fetch(this.props.apiServerUrl + call.url, {
            headers,
            method: call.method,
            body: call.requestData && JSON.stringify(call.requestData),
            credentials: 'include',
            ...call.options?.fetchOptions,
        })
            .then((response) => {
                this.handleResponse(call, response);
            })
            .catch((e: Error) => {
                if (e.name === 'AbortError') {
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

            if (response.status == 204) {
                return this.resolveCall(call, null);
            }

            response
                .json()
                .then((result) => {
                    call.responseData = result;
                    this.resolveCall(call, result);
                })
                .catch((e) => {
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
            // Try to parse JSON in response, if there are none - just ignore
            response
                .json()
                .catch(() => null)
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
        fetch(this.props.apiPingPath, {
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

    public processRequest: IProcessRequest = (url, method, data, options) => {
        let name = url;
        if (data && data.operationName) {
            name += ' ' + data.operationName;
        }

        options = { errorHandling: 'page', ...options };

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

    public uploadFile(url: string, file: File, options: FileUploadOptions) {
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
                if (!new RegExp('^2[0-9][0-9]').test(xhr.status.toString())) {
                    reject({ error: { isError: true, message: xhr.response && JSON.parse(xhr.response)?.error?.message } });
                }

                removeAllListeners();
                resolve((xhr.response && { ...JSON.parse(xhr.response) }) || null);
            };
            xhr.send(formData);
        });
    }
}
