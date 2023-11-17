import { BaseContext } from './BaseContext';
import { AnalyticsContext } from './AnalyticsContext';
import { IErrorContext } from '../types';
import { ModalContext } from './ModalContext';

export class ErrorContext extends BaseContext implements IErrorContext {
    constructor(private analyticsCtx: AnalyticsContext, private modalCtx: ModalContext) {
        super();
        this.analyticsCtx = analyticsCtx;
    }

    public currentError: Error = null;
    public errorCallback: Function = null;
    public reportError(error: Error) {
        this.currentError = error;

        this.errorCallback && this.errorCallback(error);
        this.update({});
    }

    public discardError() {
        this.currentError = null;
    }

    public recover() {
        this.discardError();
        this.update({});
    }

    public onError(callback: Function) {
        this.errorCallback = callback;
    }
}

export interface ErrorPageInfo {
    /** Error status code */
    status?: number;

    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    imageUrl?: string;
    mobileImageUrl?: string;
}

export class UuiError extends Error {
    constructor(public info: ErrorPageInfo) {
        super('UUI Error');
        this.name = 'UuiError';
        // Set the prototype explicitly.
        // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, UuiError.prototype);
    }
}
