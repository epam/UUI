import { DataRowProps } from '@epam/uui-core';

export interface ICanBeInvalid {
    isInvalid?: boolean;
    validationMessage?: string;
    validationProps?: { [key: string]: ICanBeInvalid };
}

export interface DataRowOptions<TItem, TId> extends ICanBeInvalid {
    // properties, which can be used for rowOptoins and getRowOptions configuration
    isDisabled?: boolean;
    checkbox?: { isVisible: boolean, isDisabled?: boolean } & ICanBeInvalid;
    isSelectable?: boolean;
    onClick?(rowProps: DataRowProps<TItem, TId>): void;
    link?: {
        pathname: string;
        query?: any;
        search?: string;
        key?: string;
        hash?: string;
        state?: any;
    };
    isReadonly?: boolean;
    isRequired?: boolean;

    // properties, which are used for getRowOptions only
    value?: TItem;
    onValueChange?(item: TItem): void;

    dnd?: {
        srcData?: any;
        dstData?: any;
        canAcceptDrop?(params: {
            srcData: any;
            dstData?: any;
            offsetLeft: number;
            offsetTop: number;
            targetWidth: number;
            targetHeight: number;
        }): {
            top?: boolean;
            bottom?: boolean;
            left?: boolean;
            right?: boolean;
            inside?: boolean;
        } | null;
        onDrop?(data: {
            srcData: any;
            dstData?: any;
            offsetLeft: number;
            offsetTop: number;
            targetWidth: number;
            targetHeight: number;
            position: 'top' | 'bottom' | 'left' | 'right' | 'inside';
        }): void;
    };
}
