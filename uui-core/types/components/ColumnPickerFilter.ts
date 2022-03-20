import { DataSourceItemId } from "../dataSources";
import { PickerBaseProps } from "./PickerBase";

export type ColumnPickerFilterCoreProps <TItem, TId extends DataSourceItemId> = PickerBaseProps<TItem, TId> & {
    showSearch?: boolean;
    close?: () => void;
};