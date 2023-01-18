import { createContext, Dispatch, SetStateAction } from "react";

export interface SelectionRange {
    startColumnIndex: number;
    startRowIndex: number;
    endColumnIndex: number;
    endRowIndex: number;
    isCopying?: boolean;
}

interface SelectedCell<T, E = T> {
    originalValue: T;
    replicatedValue: E;
}

export type OnReplicationFn<T, E = T> = (
    value: T,
    selection: {
        startCellValue: T,
        selectionRange: SelectionRange,
        selectedCells: SelectedCells,
    },
) => E;

interface SelectedCellActions<T, E = T> {
    onValueChange: (value: T) => void;
    onReplication: OnReplicationFn<T, E>;
}

export interface SelectedCells<T = unknown> {
    [row: string]: {
        [column: string]: SelectedCell<T>;
    };
}

export interface SelectedCellsActions<T = unknown> {
    [row: string]: {
        [column: string]: SelectedCellActions<T>;
    };
}

export interface CellLocation {
    row: number;
    column: number;
}

export interface CellSelection <T = unknown> extends SelectedCellActions<T> {
    location: CellLocation;
    value: T;
}

export interface SelectionContextState <T = unknown> {
    selectionRange: SelectionRange;
    setSelection: <T>(selection: CellSelection<T> | null, selectionRange: SetStateAction<SelectionRange>) => void;
    selectedCells: SelectedCells<T>;
    selectedCellsActions: SelectedCellsActions<T>;
}

export const DataTableSelectionContext = createContext<SelectionContextState>({
    selectionRange: null,
    setSelection: null,
    selectedCells: null,
    selectedCellsActions: null,
});