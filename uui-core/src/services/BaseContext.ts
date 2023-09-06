import ReactDOM from 'react-dom';

export class BaseContext<TState = {}> {
    private handlers: ((state: TState) => void)[] = [];

    init() {

    }

    subscribe(handler: (state: TState) => void) {
        this.handlers.push(handler);
    }

    unsubscribe(handler: (state: TState) => void) {
        this.handlers = this.handlers.filter((h) => h !== handler);
    }

    update(state: TState) {
        ReactDOM.unstable_batchedUpdates(() => {
            this.handlers.forEach((h) => h && h(state));
        });
    }

    destroyContext() {
        this.handlers = [];
    }
}
