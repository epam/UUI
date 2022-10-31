import { AcceptDropParams, DataColumnProps, DropParams, DropPositionOptions, IColumnConfig } from "@epam/uui-core";

export interface ICanBeFixed {
    fix?: 'left' | 'right';
}
export type DndDataType = { column: DataColumnProps, columnConfig: IColumnConfig };
export interface ColumnsConfigurationRowProps extends GroupedDataColumnProps {
    toggleVisibility: () => void;
    togglePin: () => void;
    onCanAcceptDrop: (props: AcceptDropParams<DndDataType, DndDataType>) => DropPositionOptions | null;
    onDrop: (params: DropParams<DndDataType, DndDataType>) => void;
    columnConfig: IColumnConfig;
    isDndAllowed: boolean;
    isPinnedAlways: boolean;
}
export type GroupedColumnsType<T extends DataColumnProps> = {
    hidden: T[],
    displayedUnpinned: T[],
    displayedPinned: T[],
};

export interface GroupedDataColumnProps extends DataColumnProps {
    groupKey?: keyof GroupedColumnsType<DataColumnProps>;
}
