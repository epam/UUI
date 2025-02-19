// Redux mini

type Reducer<TPayload, TState> = (params: TPayload) => (state: TState) => TState;
type Action<TPayload> = { name: string; payload: TPayload };
type ActionFactory<TPayload> = (payload: TPayload) => Action<TPayload>;
type ActionDispatcher<TPayload> = (payload: TPayload) => void;
type ReducersSet<TActions, TState> = { [P in keyof TActions]: Reducer<TActions[P], TState> };
type ActionFactorySet<TActions> = { [TActionName in keyof TActions]: ActionFactory<TActions[TActionName]> };
type ActionDispatcherSet<TActions> = { [TActionName in keyof TActions]: ActionDispatcher<TActions[TActionName]> };

export function createStore<TState, TActions>(initialState: TState, reducers: ReducersSet<TActions, TState>): ActionDispatcherSet<TActions> {
    let state = initialState;

    function dispatch(action: Action<any>) {
        const reducer = (reducers as any)[action.name as any];
        // eslint-disable-next-line no-console
        console.log(`Dispatching ${action.name}. Payload: ${JSON.stringify(action.payload)}`);
        const newState = reducer(action.payload)(state);
        // eslint-disable-next-line no-console
        console.log(`State changed: ${JSON.stringify(state)} => ${JSON.stringify(newState)}`);
        state = newState;
    }

    function wrapDispatch<TPayload>(name: string) {
        return function (payload: TPayload) {
            dispatch({ name, payload });
        };
    }

    const store: any = {};
    Object.keys(reducers).map((name) => (store[name] = wrapDispatch(name)));
    return store;
}

// Implementation

export interface AppState {
    stringVal: string;
    intVal: number;
}

const initialState: AppState = {
    stringVal: 'initial value',
    intVal: 100500,
};

const setVal = (stringVal: string) => (state: AppState) => ({ ...state, stringVal });
const clearVal = () => setVal('');

export const store = createStore(initialState, { setVal, clearVal });

store.setVal('Test');
store.clearVal({});
