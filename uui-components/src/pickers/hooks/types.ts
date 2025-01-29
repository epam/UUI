import {
    DataSourceState, IEditable, IHasCaption, IHasRawProps, IModal, PickerBaseOptions, PickerBaseProps,
    PickerFooterProps, PickerInputBaseProps, SortingOption,
} from '@epam/uui-core';
import { Dispatch, SetStateAction } from 'react';

export type UsePickerInputProps<TItem, TId, TProps> = PickerInputBaseProps<TItem, TId> & TProps & {
    toggleModalOpening?(opened: boolean): void;
    shouldShowBody?(): boolean;
};

export interface UsePickerInputStateProps extends UsePickerStateProps {}

export interface PickerInputState extends PickerState {
    opened: boolean;
    setOpened: Dispatch<SetStateAction<boolean>>;
    isSearchChanged: boolean;
    setIsSearchChanged: Dispatch<SetStateAction<boolean>>;
}

export interface UsePickerStateProps {
    dataSourceState?: Partial<DataSourceState>;
}

export interface PickerState {
    dataSourceState: DataSourceState;
    setDataSourceState: Dispatch<SetStateAction<DataSourceState>>;
    showSelected: boolean;
    setShowSelected: Dispatch<SetStateAction<boolean>>;
}

export type PickerListBaseProps<TItem, TId> = Exclude<PickerBaseProps<TItem, TId>, 'cascadeSelection'> & {
    /**
     * Number of default items to show initially, when nothing is selected.
     * @default 10
     */
    maxDefaultItems?: number;

    /**
     * Maximum total number of items to show, including selected
     * @default 50
     */
    maxTotalItems?: number;

    /**
     * Ids of items to show first.
     * If not specified, top props.maxDefaultItems will be shown according to the DataSource sorting settings (default is 10)
     */
    defaultIds?: TId[];

    /** If provided, top picks will be automatically adjusted based on last user selection, and stored as user setting under provided key */
    settingsKey?: string;

    sortBy?(item: TItem, sorting: SortingOption): string;
};

export type UsePickerListProps<TItem, TId, TProps> = PickerListBaseProps<TItem, TId> & TProps & {};

export interface PickerModalOptions<TItem, TId> extends IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    /** Render callback for custom filters block. This block will be rendered befor the items list.
     If omitted, nothing will be rendered.
     */
    renderFilter?(editableFilter: IEditable<any>): React.ReactNode;
    /** Render callback for modal footer.
     If omitted, default footer will be rendered.
     */
    renderFooter?: (props: PickerFooterProps<TItem, TId> & Partial<IModal<any>>) => React.ReactNode;
    /**
     * If true, prevent modal window closing by click outside modal
     * @default false
     */
    disallowClickOutside?: boolean;
}

export type PickerModalScalarProps<TId, TItem> =
    | ({ selectionMode: 'single'; valueType: 'id'; initialValue: TId } & IModal<TId>)
    | ({ selectionMode: 'single'; valueType: 'entity'; initialValue: TItem } & IModal<TItem>);
export type PickerModalArrayProps<TId, TItem> =
    | ({ selectionMode: 'multi'; valueType: 'id'; initialValue: TId[] } & IModal<TId[]>)
    | ({ selectionMode: 'multi'; valueType: 'entity'; initialValue: TItem[] } & IModal<TItem[]>);

export type UsePickerModalProps<TItem, TId> = PickerBaseOptions<TItem, TId> &
IHasCaption &
(PickerModalScalarProps<TId, TItem> | PickerModalArrayProps<TId, TItem>) &
PickerModalOptions<TItem, TId>;
