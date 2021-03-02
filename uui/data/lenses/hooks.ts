import * as React from 'react';
import { IEditable } from '../../types';
import { LensBuilder } from './LensBuilder';
import { SetStateAction, Dispatch } from 'react';

/**
 * Experimental lens hook implementation.
 * API can be changed in future.
 */
export function useLens<TBig, TSmall>(
    editable: IEditable<TBig>,
    get: (b: LensBuilder<TBig, TBig>) => LensBuilder<TBig, TSmall>,
): IEditable<TSmall> {
    const editableRef = React.useRef<IEditable<TBig>>();
    editableRef.current = editable;

    const builder = React.useMemo(() => {
        const rootBuilder = new LensBuilder<TBig, TBig>({
            get(big: any) { return editableRef.current.value; },
            set(big: any, small: any) { editableRef.current.onValueChange(small); return small; },
            getValidationState(big: any) { return editableRef.current; },
        });
        return get(rootBuilder);
    }, [editable.onValueChange]);

    return builder.toProps();
}