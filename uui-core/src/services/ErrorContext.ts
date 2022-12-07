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