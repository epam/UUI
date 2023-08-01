import { IEditable } from '@epam/uui-core';

// combine reducers and lenses somehow...

type Reducer<TPayload, TState> = (params: TPayload) => (state: TState) => TState;
type Action<TPayload> = { name: string; payload: TPayload };
type ActionFactory<TPayload> = (payload: TPayload) => Action<TPayload>;
type ActionDispatcher<TPayload> = (payload: TPayload) => void;
type ReducersSet<TActions, TState> = { [P in keyof TActions]: Reducer<TActions[P], TState> };
type ActionFactorySet<TActions> = { [TActionName in keyof TActions]: ActionFactory<TActions[TActionName]> };
type ActionDispatcherSet<TActions> = { [TActionName in keyof TActions]: ActionDispatcher<TActions[TActionName]> };

class Optic<TState, TActions = {}> {
    actions: TActions;
    get() {
        return null as TState;
    }

    set(e: TActions) {}
    prop<TKey extends keyof TState>(name: TKey): Optic<TState[TKey], {}> {
        return null;
    }

    bind(host: Optic<TState, TActions>) {
        return this;
    }

    // extend<T>(fn: (h: Host<TState, TActions>) => T): (Optic<TState, TActions> & T) {
    //     return null;
    // }

    views<TNewViews>() {}
    reducers<TNewActions>(reducersSet: ReducersSet<TNewActions, TState>): Optic<TState, TActions & ActionDispatcherSet<TNewActions>> {
        return null;
    }

    compose<TChild>(create: (host: Optic<TState, TActions>) => TChild) {
        return null as Optic<TState, TActions> & TChild;
    }
}

interface ItemState {
    id: number;
    name: string;
}

const setName = (a: { name: string }) => (s: ItemState) => ({ ...s, name: a.name });

const itemController = new Optic<ItemState>().reducers({ setName });

interface AppState {
    name: string;
    value: number;
    mult: number;
    item: ItemState;
}

const setVal = (a: { name: string }) => (s: AppState) => ({ ...s, stringVal: a.name });
const setItem = (a: { item: ItemState }) => (s: AppState) => ({ ...s, item: a.item });
const clearVal = () => setVal({ name: '' });

const o = new Optic<AppState, {}>().reducers({ setVal, clearVal, setItem });
// .compose(host => ({ item: itemController.bind(host.prop('item'))}))

o.actions.clearVal({});
o.actions.setVal({ name: 'test' });
