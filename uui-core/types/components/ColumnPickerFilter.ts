import { PickerBaseProps } from "./PickerBase";

export type ColumnPickerFilterCoreProps <TItem, TId> = PickerBaseProps<TItem, TId> & {
    showSearch?: boolean;
    close?: () => void;
};