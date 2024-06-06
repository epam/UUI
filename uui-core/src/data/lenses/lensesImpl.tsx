import { IImmutableMap, IMap, Metadata } from '../../types';
import { cloneMap } from '../processing';
import { blankValidationState } from '../validation';
import { ValidationState } from './types';

export interface ILensImpl<TBig, TSmall> {
    get(big: TBig | null): TSmall | null;
    set(big: TBig | null, small: TSmall): TBig;
    getValidationState?(big?: ValidationState): ValidationState | undefined;
    getMetadata?(big?: Metadata<TBig>): Metadata<TSmall> | undefined;
}
export const identityLens: ILensImpl<any, any> = {
    get(big: any) {
        return big;
    },
    set(big: any, small: any) {
        return small;
    },
    getValidationState(big: ValidationState) {
        return big;
    },
    getMetadata(big: Metadata<any>) {
        return big;
    },
};

export function identity<A>(): ILensImpl<A, A> {
    return identityLens;
}

function getMetadata<T>(big: T) {
    const metadata: Metadata<T> = big || { all: { props: {} } };
    const metadataProps = metadata.all;
    const { isDisabled, isRequired, isReadonly } = metadata;
    return {
        ...metadataProps, isDisabled, isReadonly, isRequired,
    } as any;
}

function getValidationState(big: ValidationState, field: string | number, defaultValidationStateProps: ValidationState['validationProps'] = {}) {
    const validationStateProps = (big || blankValidationState).validationProps || defaultValidationStateProps;
    return validationStateProps[field];
}

export function prop<TObject, TKey extends keyof TObject>(name: TKey): ILensImpl<TObject, TObject[TKey]> {
    return {
        get(big) {
            if (big == null) {
                return undefined;
            } else {
                return big[name];
            }
        },
        set(big: TObject, small: TObject[TKey]) {
            const newObject = {
                ...(big as any),
                [name]: small,
            };
            return newObject;
        },
        getValidationState(big: ValidationState) {
            return getValidationState(big, name as string, { [name]: { isInvalid: false } });
        },
        getMetadata(big: Metadata<TObject>) {
            const metadata: Metadata<TObject> = big || { props: {} };
            const metadataProps = metadata.props || ({} as any);
            const { isDisabled, isRequired, isReadonly } = metadata;
            return {
                isDisabled, isReadonly, isRequired, ...metadataProps[name],
            };
        },
    };
}

export function key<TItem, TId>(id: TId): ILensImpl<IMap<TId, TItem> | IImmutableMap<TId, TItem>, TItem> {
    return {
        get(big: IMap<TId, TItem> | IImmutableMap<TId, TItem>) {
            if (big == null) {
                return undefined;
            } else {
                return big.get(id);
            }
        },
        set(big: IMap<TId, TItem> | IImmutableMap<TId, TItem>, small: TItem) {
            const newMap = cloneMap(big);
            return newMap.set(id, small);
        },
        getValidationState(big: ValidationState) {
            return getValidationState(big, id as string);
        },
        getMetadata(big: Metadata<IMap<TId, TItem> | IImmutableMap<TId, TItem>>) {
            return getMetadata(big);
        },
    };
}

export function index<TItem>(num: number): ILensImpl<TItem[], TItem> {
    return {
        get(big: TItem[]) {
            if (big == null) {
                return undefined;
            } else {
                return big[num];
            }
        },
        set(big: TItem[], small: TItem) {
            const newArray = [...big];
            newArray[num] = small;
            return newArray;
        },
        getValidationState(big: ValidationState) {
            return getValidationState(big, num);
        },
        getMetadata(big: Metadata<TItem[]>) {
            return getMetadata(big);
        },
    };
}

export function defaultValue<A>(value: A): ILensImpl<A, A> {
    return {
        get(big: A) {
            if (big === undefined || big === null) {
                return value;
            } else {
                return big;
            }
        },
        set(big: A, small: A) {
            return small;
        },
        getMetadata(big: Metadata<any>) {
            return big;
        },
        getValidationState(big: any) {
            return big;
        },
    };
}

export function compose<TBig, TMiddle, TSmall>(left: ILensImpl<TBig, TMiddle>, right: ILensImpl<TMiddle, TSmall>): ILensImpl<TBig, TSmall> {
    if (left === identityLens) {
        return right as any;
    }

    if (right === identityLens) {
        return left as any;
    }

    return {
        get(big: TBig) {
            const middle = left.get(big);
            const small = right.get(middle);
            return small;
        },
        set(big: TBig, small: TSmall) {
            let middle = left.get(big);
            middle = right.set(middle, small);
            return left.set(big, middle);
        },
        getValidationState(big?: TBig) {
            const middle = left.getValidationState && left.getValidationState(big);
            const small = right.getValidationState && right.getValidationState(middle);
            return small;
        },
        getMetadata(big?: Metadata<TBig>) {
            const middle = left.getMetadata && left.getMetadata(big);
            const small = right.getMetadata && right.getMetadata(middle);
            return small;
        },
    };
}
