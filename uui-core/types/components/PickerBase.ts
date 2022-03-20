import { ReactNode } from "react";
import { IAnalyticableOnChange, IEditable } from "../props";
import { SortingOption } from "../dataQuery";
import { DataRowOptions, DataRowProps, DataSourceItemId, IDataSource, IDataSourceView } from "../dataSources";

export type SinglePickerProps<TId, TItem> = ({ selectionMode: 'single', valueType: 'id'} & IEditable<TId>) | ({ selectionMode: 'single', valueType?: 'entity' } & IEditable<TItem>);
export type ArrayPickerProps<TId, TItem> = ({ selectionMode: 'multi', valueType: 'id', emptyValue?: [] | null } & IEditable<TId[]>)
    | ({ selectionMode: 'multi', valueType: 'entity', emptyValue?: [] | null } & IEditable<TItem[]>);

export type PickerBindingProps<TItem, TId> =
    (SinglePickerProps<TId, TItem> | ArrayPickerProps<TId, TItem>);

export type PickerBindingValueType = 'scalar' | 'array';

export type PickerBaseOptions<TItem, TId extends DataSourceItemId> = {
    entityName?: string;
    entityPluralName?: string;
    dataSource: IDataSource<TItem, TId, any>;
    getName?: (item: TItem) => string;
    renderRow?: (props: DataRowProps<TItem, TId>) => ReactNode;
    getRowOptions?: (item: TItem, index: number) => DataRowOptions<TItem, TId>;
    renderNotFound?: (props: { search: string, onClose: () => void }) => ReactNode;
    emptyValue?: undefined | null | [];
    sortBy?(item: TItem, sorting: SortingOption): any;
    filter?: any;
    sorting?: SortingOption;
    cascadeSelection?: boolean;
    isFoldedByDefault?(item: TItem): boolean;
    getSearchFields?(item: TItem): string[];
    renderFooter?: (props: PickerFooterProps<TItem, TId>) => ReactNode;
};

export type PickerFooterProps<TItem, TId extends DataSourceItemId> = {
    view: IDataSourceView<TItem, TId, any>;
    showSelected: IEditable<boolean>;
    clearSelection: () => void;
};

export type PickerBaseProps<TItem, TId extends DataSourceItemId> =
    PickerBaseOptions<TItem, TId> & PickerBindingProps<TItem, TId> & IAnalyticableOnChange<any>;