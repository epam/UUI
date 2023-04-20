import {
    AcceptDropParams, DataColumnProps, DropParams, DropPositionOptions, IColumnConfig,
} from '@epam/uui-core';

export type DndDataType = { column: DataColumnProps; columnConfig: IColumnConfig };
export interface ColumnsConfigurationRowProps extends GroupedDataColumnProps {
    toggleVisibility: () => void;
    togglePin: () => void;
    onCanAcceptDrop: (props: AcceptDropParams<DndDataType, DndDataType>) => DropPositionOptions | null;
    onDrop: (params: DropParams<DndDataType, DndDataType>) => void;
    columnConfig: IColumnConfig;
    isDndAllowed: boolean;
    isPinned: boolean;
    isPinnedAlways: boolean;
}
export type GroupedColumnsType = {
    hidden: ColumnsConfigurationRowProps[];
    displayedUnpinned: ColumnsConfigurationRowProps[];
    displayedPinned: ColumnsConfigurationRowProps[];
};

export interface GroupedDataColumnProps extends DataColumnProps {
    groupKey?: keyof GroupedColumnsType;
}
