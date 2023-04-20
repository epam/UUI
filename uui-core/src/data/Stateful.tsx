import * as React from 'react';
import { IEditable } from '../types/props';
import {
    ReactElement, useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { useUuiContext } from '../services';

const reduxDevTools: any = null; // (window as any).__REDUX_DEVTOOLS_EXTENSION__;

type StatefulStorageType = 'state' | 'query';
type StatefulStorageSettings<T> = StatefulStorageType; // TBD: allow per-field settings

export interface StatefulProps<T> {
    initialState: Partial<T>;
    render(props: IEditable<T>): React.ReactNode;
    storage?: StatefulStorageSettings<T>;
}

const StatefulImpl = <T extends unknown = any>(props: StatefulProps<T>) => {
    const [state, setState] = useState<T>(props.initialState as T);
    const context = useUuiContext();
    const devTools = useRef<any>();

    useEffect(() => {
        devTools.current = reduxDevTools?.connect() ?? undefined;
        return () => {
            devTools.current?.disconnect();
        };
    }, []);

    const currentState = useMemo((): T => {
        if (props.storage == null || props.storage === 'state') {
            return state;
        } else if (props.storage === 'query') {
            const query = context.uuiRouter.getCurrentLink().query;
            return { ...props.initialState, ...query };
        }
    }, [
        props.storage,
        props.initialState,
        state,
        context,
    ]);

    const handleStateUpdate = useCallback(
        (newState: T) => {
            if (reduxDevTools) {
                devTools.current.send('onValueChange', newState);
            }

            if (props.storage == null || props.storage === 'state') {
                setState(newState);
            } else if (props.storage === 'query') {
                const link = context.uuiRouter.getCurrentLink();
                context.uuiRouter.redirect({ ...link, query: newState });
            }
        },
        [
            reduxDevTools,
            devTools,
            props.storage,
            context,
        ],
    );

    return props.render({
        value: currentState,
        onValueChange: handleStateUpdate,
    }) as ReactElement;
};

export const Stateful = React.memo(StatefulImpl) as typeof StatefulImpl;
