import {ICanBeInvalid, Metadata} from '../../types';
import { blankValidationState } from '../validation';

export interface ILensImpl<TBig, TSmall> {
    get(big: TBig | null): TSmall | null;
    set(big: TBig | null, small: TSmall): TBig;
    getValidationState?(big?: ICanBeInvalid): ICanBeInvalid | undefined;
    getMetadata?(big?: Metadata<TBig>): Metadata<TSmall> | undefined;
}

export const identityLens = {
    get(big: any) {
        return big;
    },
    set(big: any, small: any) {
        return small;
    },
};

export function identity<A>(): ILensImpl<A, A> {
    return identityLens;
}

export function prop<TObject, TKey extends keyof TObject>(name: TKey): ILensImpl<TObject, TObject[TKey]> {
    return {
        get(big) {
            if (big == null) {
                return null;
            } else {
                return big[name];
            }
        },
        set(big: TObject, small: TObject[TKey]) {
            const newObject = {
                ...big as any,
                [name]: small,
            };
            return newObject;
        },
        getValidationState(big: ICanBeInvalid) {
            let validationStateProps = (big || blankValidationState).validationProps || {[name]: {isInvalid: false}};
            return validationStateProps[name as string];
        },
        getMetadata(big: Metadata<TObject>) {
            let metadata: Metadata<TObject> = big || {props: {}};
            let metadataProps = metadata.props || ({} as any);
            let {isDisabled, isRequired, isReadonly} = metadata;
            return {isDisabled, isReadonly, isRequired, ...metadataProps[name] };
        },
    };
}

export function index<TItem>(index: number): ILensImpl<TItem[], TItem> {
    return {
        get(big: TItem[]) {
            if (big == null) {
                return null;
            } else {
                return big[index];
            }
        },
        set(big: TItem[], small: TItem) {
            const newArray = [...big];
            newArray[index] = small;
            return newArray;
        },
        getValidationState(big: ICanBeInvalid) {
            let validationStateProps = (big || blankValidationState).validationProps || {};
            return validationStateProps[index];
        },
        getMetadata(big: Metadata<TItem[]>) {
            let metadata: Metadata<TItem[]> = big || {all: {props: {}}};
            let metadataProps = metadata.all;
            let {isDisabled, isRequired, isReadonly} = metadata;
            return {...metadataProps, isDisabled, isReadonly, isRequired} as any;
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
            big = left.set(big, middle);
            return big;
        },
        getValidationState(big?: TBig) {
            const middle = left.getValidationState && left.getValidationState(big);
            const small  = right.getValidationState && right.getValidationState(middle);
            return small;
        },
        getMetadata(big?: Metadata<TBig>) {
            const middle = left.getMetadata && left.getMetadata(big);
            const small  = right.getMetadata && right.getMetadata(middle);
            return small;
        },
    };
}