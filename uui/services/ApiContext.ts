import { BaseContext } from './BaseContext';
import { ErrorContext } from './ErrorContext';
import { AnalyticsContext } from './AnalyticsContext';
import { IApiContext, ApiStatus, ApiRecoveryReason, ApiCallOptions, ApiCallInfo } from '../types';
import { getCookie } from '../helpers';

interface ApiCall extends ApiCallInfo {
    resolve: (value?: any) => any;
    reject: (value?: any) => any;
}

export class ApiCallError extends Error {
    constructor(public call: ApiCall) {
        super("ApiContext: XHR call failed");
    }
}

export interface FileUploadOptions {
    onProgress?: (progress: number) => any;
}

export interface FileUploadResponse {
    id: number;
    name: string;
    size: number;
    path?: string;
    type?: BlockTypes;
    extension?: string;
}

export type BlockTypes = 'attachment' | 'iframe' | 'image';

const reloginPath = '/auth/login';

export class ApiContext extends BaseContext implements IApiContext {
    private queue: ApiCall[] = [];
    private isRunScheduled = false;
    public status: ApiStatus = 'idle';
    public recoveryReason: ApiRecoveryReason | null = null;
    public lastHttpStatus?: number;

    constructor(private errorCtx: ErrorContext, private serverUrl = '', private analyticsCtx?: AnalyticsContext) {
        super();
        this.errorCtx = errorCtx;
        this.analyticsCtx = analyticsCtx;

        // If this window is opened by another app in another window to re-login, tell it that Auth was passed ok
        window.opener && window.location.pathname === reloginPath && window.opener.postMessage("authSuccess", "*");

        // If we opened another window to relogin and check auth - close this window and resume
        window.addEventListener('message', (e) => {
            if (e.data == 'authSuccess') {
                if (this.status === 'recovery' && this.recoveryReason === 'auth-lost') {
                    this.setStatus('running');
                    this.runQueue();
                }
                (e.source as any).close();
            }
        });
    }

    public getActiveCalls(): ApiCallInfo[] {
        return this.queue;
    }

    public reset() {
        if (this.status === 'error') {
            this.queue = [];
            this.status = 'running';
        }
    }

    private setStatus(status: ApiStatus, recoveryReason: ApiRecoveryReason = null) {
        this.status = status;
        this.recoveryReason = recoveryReason;
        this.update({});
    }

    private startCall(call: ApiCall) {
        const headers = new Headers();
        const csrfCookie = getCookie('CSRF-TOKEN');
        headers.append('Content-Type', 'application/json');
        if (csrfCookie) {
            headers.append('X-CSRF-Token', csrfCookie);
        }
        call.attemptsCount += 1;
        call.status = 'running';
        call.startedAt = new Date();
        fetch(this.serverUrl + call.url, {
            headers,
            method: call.method,
            body: call.requestData && JSON.stringify(call.requestData),
            credentials: 'include',
            ...call.options?.fetchOptions,
        }).then(response => {
            this.handleResponse(call, response);
        }).catch((e: Error) => {
            if (e.name === "AbortError") {
                this.removeFromQueue(call);
            }
            if (call.attemptsCount < 2) {
                this.handleConnectionLost(call, 'connection-lost');
            } else {
                this.handleError(call, new ApiCallError(call));
            }
        });
    }

    private handleResponse(call: ApiCall, response: Response) {
        call.finishedAt = new Date();
        call.httpStatus = response.status;
        if (response.ok) {
            this.analyticsCtx?.sendApiTiming({
                name: 'timing_complete',
                parameters: {
                    value: call.finishedAt.getTime() - call.startedAt.getTime(),
                    name: call.name,
                    event_category: window.location.pathname,
                },
            });

            if (response.status == 204) {
                return this.resolveCall(call, null);
            }

            response.json()
                .then(result => {
                    call.responseData = result;
                    this.resolveCall(call, result);
                })
                .catch(e => {
                    /* Problem with response JSON parsing */
                    this.handleError(call, e);
                });
        } else if (/* Network and server-related problems. We'll ping the server and then retry the call in this case. */
                (response.status === 408 /* Request Timeout */
                    || response.status === 420 /* Enhance Your Calm */
                    || response.status === 429 /* Too Many Requests */
                    || response.status === 502 /* Bad Gateway */
                    || response.status === 503 /* Service Unavailable */
                    || response.status === 504 /* Gateway Timeout */
                ) && call.attemptsCount < 2 /*
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

            this.handleConnectionLost(call, reason);
        } else if (response.status === 401) /* Authentication cookies invalidated */ {
            this.handleAuthLost(call);
        } else {
            // Try to parse JSON in response, if there are none - just ignore
            response.json().catch(() => null).then(result => {
                call.responseData = result;
                this.handleError(call, new ApiCallError(call));
            });
        }
    }

    private removeFromQueue(call: ApiCall) {
        this.queue = this.queue.filter(c => c !== call);
        if (this.status === 'error' && !this.queue.some(c => c.status === 'error')) {
            this.setStatus('idle');
            this.runQueue();
        }
    }

    private resolveCall(call: ApiCall, result: any) {
        this.removeFromQueue(call);
        call.resolve(result);
    }

    private handleError(call: ApiCall, error: ApiCallError) {
        call.status = 'error';
        if (call.options?.errorHandling === 'manual') {
            this.removeFromQueue(call);
        } else {
            this.setStatus('error');
        }
        call.reject(error);
    }

    private runQueue() {
        this.isRunScheduled = false;
        if (this.status === 'idle' || this.status === 'running') {
            this.queue.filter(c => c.status === 'scheduled').forEach(c => this.startCall(c));
        }
    }

    private handleConnectionLost(call: ApiCall, reason: ApiRecoveryReason) {
        call.status = 'scheduled';

        if (this.status == 'recovery') {
            return;
        }
        this.setStatus('recovery', reason);
        this.recoverConnection();
    }

    private recoverConnection() {
        const retry = () => setTimeout(() => this.recoverConnection(), 2000);
        fetch('/auth/ping', {
            method: 'GET',
            credentials: 'include',
        }).then(response => {
            if (response.ok) {
                this.setStatus('running');
                this.runQueue();
            } else {
                retry();
            }
        }).catch(retry);
    }

    private handleAuthLost(call: ApiCall) {
        call.status = 'scheduled';
        if (this.status === 'recovery') {
            return;
        }
        this.setStatus('recovery', 'auth-lost');
        window.open(reloginPath);
    }

    private scheduleRun() {
        if (!this.isRunScheduled) {
            setTimeout(() => this.runQueue(), 0);
            this.isRunScheduled = false;
        }
    }

    public processRequest(url: string, method: string, data?: any, options?: ApiCallOptions): Promise<any> {
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
    }

    public uploadFile(url: string, file: File, options: FileUploadOptions) {

        const trackProgress = (event: any) => {
            const progress = +((event.loaded / event.total) * 100).toFixed(2);
            options.onProgress && options.onProgress(progress);
        };

        return new Promise<FileUploadResponse>((resolve, reject) => {
            const formData  = new FormData();
            formData.append('file', file);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);

            const csrfCookie = getCookie('CSRF-TOKEN');
            if (csrfCookie) {
                xhr.setRequestHeader('X-CSRF-Token', csrfCookie);
            }
            xhr.withCredentials = true;

            if (options.onProgress) {
                xhr.upload.addEventListener("progress", trackProgress, false);
            }


            xhr.onreadystatechange = () => {
                if (xhr.readyState !== 4) return;
                if (!(new RegExp('^2[0-9][0-9]')).test(xhr.status.toString())) {
                    /*handle error*/
                    reject(xhr.response);
                }

                xhr.upload.removeEventListener("progress", trackProgress, false);

                resolve(JSON.parse(xhr.response));
            };
            xhr.send(formData);
        });

    }
}