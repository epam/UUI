import {
    AcceptDropParams, DataColumnProps, DropParams, DropPositionOptions, ICanBeFixed, IColumnConfig, DataColumnGroupProps,
} from '@epam/uui-core';

export type TColumnPinPosition = ICanBeFixed['fix'] | undefined;

export type DndDataType = { column: DataColumnProps; columnConfig: IColumnConfig };
export interface ColumnsConfigurationRowProps extends GroupedDataColumnProps {
    toggleVisibility: () => void;
    /**
     * Pins column to the specified position. If 'fix' parameter is absent, the column is unpinned.
     * @param fix - The position to which the column should be pinned. Omit to unpin the column.
     */
    togglePin: (fix: TColumnPinPosition) => void;
    onCanAcceptDrop: (props: AcceptDropParams<DndDataType, DndDataType>) => DropPositionOptions | null;
    onDrop: (params: DropParams<DndDataType, DndDataType>) => void;
    columnConfig: IColumnConfig;
    isDndAllowed: boolean;
    /**
     * The position at which the column is pinned. If the value is undefined, it means the column is not pinned.
     */
    fix: TColumnPinPosition;
    isPinnedAlways: boolean;
    /**
     * Full group configuration object for the column, if any
     */
    columnGroup?: DataColumnGroupProps;
}
export type GroupedColumnsType = {
    hidden: ColumnsConfigurationRowProps[];
    displayedUnpinned: ColumnsConfigurationRowProps[];
    displayedPinnedLeft: ColumnsConfigurationRowProps[];
    displayedPinnedRight: ColumnsConfigurationRowProps[];
};

export interface GroupedDataColumnProps extends DataColumnProps {
    groupKey?: keyof GroupedColumnsType;
}
