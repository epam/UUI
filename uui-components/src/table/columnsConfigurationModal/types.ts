import { AcceptDropParams, DataColumnProps, DropParams, DropPositionOptions, IColumnConfig } from "@epam/uui-core";

export type TFix = 'left' | 'right';
export type DndDataType = { column: DataColumnProps, columnConfig: IColumnConfig };
export interface IManageableColumn extends DataColumnProps {
    toggleVisibility: () => void;
    togglePin: () => void;
    onCanAcceptDrop: (props: AcceptDropParams<DndDataType, DndDataType>) => DropPositionOptions | null;
    onDrop: (params: DropParams<DndDataType, DndDataType>) => void;
    columnConfig: IColumnConfig;
    isDndAllowed: boolean;
    isPinnedAlways: boolean;
}
