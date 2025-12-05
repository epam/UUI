import { FetchingOptions } from 'uui-core';
import { DbRef } from './DbRef';
import {
    DbPatch, DbTablesSet, LoadingState, ILoadingTracker,
} from './types';

export interface LoaderOptions<TTables extends DbTablesSet<TTables>, TResult, TRequest> {
    api: (request: TRequest, fetchingOptions: FetchingOptions) => Promise<TResult>;
    convertToPatch?: (result: TResult) => DbPatch<TTables>;
    postProcess?: (patch: DbPatch<TTables>) => DbPatch<TTables>;
    clientToServerRequest?: (request: TRequest) => TRequest;
}

export interface LoaderResult<TRequest> extends LoadingState<TRequest> {
    promise: Promise<void>;
    reload: () => void;
}

export class Loader<TTables extends DbTablesSet<TTables>, TResult, TRequest> {
    private currentRequests: Set<Promise<void>> = new Set();
    public loaded: ILoadingTracker<TRequest, TResult>;
    private loadedAndLoading: ILoadingTracker<TRequest, TResult>;
    constructor(
        private dbRef: DbRef<TTables, any>,
        private getTracker: () => ILoadingTracker<TRequest, TResult>,
        private options: LoaderOptions<TTables, TResult, TRequest>,
    ) {
        this.loaded = getTracker();
        this.loadedAndLoading = getTracker();
    }

    private loadImpl(state: LoaderResult<TRequest>, fetchingOptions: FetchingOptions) {
        this.loadedAndLoading.append(state.missing);
        state.isLoading = true;
        let serverRequest = state.missing;
        if (this.options.clientToServerRequest) {
            serverRequest = this.options.clientToServerRequest(serverRequest);
        }
        state.promise = this.options.api(serverRequest, fetchingOptions).then((result) => {
            this.loaded.append(state.missing, result);
            this.loadedAndLoading.append(state.missing, result);
            state.missing = null;
            state.isLoading = false;
            state.isComplete = true;
            state.promise = Promise.resolve();
            const flatten = this.options.convertToPatch(result);
            this.options.postProcess && this.options.postProcess(flatten);
            this.dbRef.commitFetch(flatten);
        });

        this.currentRequests.add(state.promise);

        state.promise.finally(() => {
            this.currentRequests.delete(state.promise);
        });

        return state.promise;
    }

    public load = (inputRequest: TRequest, fetchingOptions: FetchingOptions) => {
        const result: LoaderResult<TRequest> = {
            isComplete: this.loaded.diff(inputRequest) == null,
            isLoading: false,
            request: inputRequest,
            missing: this.loadedAndLoading.diff(inputRequest),
            promise: null,
            reload: null,
        };

        result.reload = () => {
            result.missing = inputRequest;
            this.loadImpl(result, fetchingOptions);
        };

        if (result.isComplete) {
            // Everything requested is already loaded
            result.isComplete = true;
            result.isLoading = false;
            result.promise = Promise.resolve();
            return result;
        } else {
            if (result.missing == null) {
                // Everything requested is either loaded already, or being loaded
                result.isComplete = false;
                result.isLoading = true;
                // There's no good way to tell which of current requests is querying requested data - there actually can be 2 of them.
                // So we track all running requests, and await all of them in such case.
                result.promise = Promise.all(this.currentRequests.entries()).then(() => {});
                return result;
            } else {
                // Something requested is not loaded, nor being loaded. Need to perform a new request.
                this.loadImpl(result, fetchingOptions);
                return result;
            }
        }
    };
}
