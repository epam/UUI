import { ILoadingTracker } from './types';

export class SimpleLoadingTracker<TRequest, TResult> implements ILoadingTracker<TRequest, TResult> {
    private set: Set<string> = new Set();
    constructor() {}
    private getKey(request: TRequest) {
        return JSON.stringify(request);
    }

    public diff(request: TRequest) {
        return this.set.has(this.getKey(request)) ? null : request;
    }

    public append(request: TRequest, result: TResult) {
        this.set.add(this.getKey(request));
    }
}
