import React, { useEffect, useMemo, useState } from "react";
import {
    CellLocation, CellSelection, DataTableSelectionContext, SelectedCells, SelectedCellsActions,
    SelectionContextState, SelectionRange,
} from "./DataTableSelectionContext";

type BaseHash = { [row: string]: { [column: string]: unknown } };

const getStartEndIndexes = (startIndex: number, endIndex: number) =>
    startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex];

const removeNotSelected = <T extends BaseHash | BaseHash[number]>(hash: T, start: number, end: number) => {
    const keys = Object.keys(hash).map(Number);

    keys.forEach((key) => {
        if (key < start || key > end) {
            delete hash[key];
        }
    });

    return hash;
};

const removeNotSelectedCells = <T extends BaseHash>(hash: T, { startRowIndex, endRowIndex, startColumnIndex, endColumnIndex }: SelectionRange): T => {
    const [startColumn, endColumn] = getStartEndIndexes(startColumnIndex, endColumnIndex);
    const [startRow, endRow] = getStartEndIndexes(startRowIndex, endRowIndex);

    const hashWithoutUnselectedRows = removeNotSelected(hash, startRow, endRow);
    return Object.keys(hash).reduce<T>((localHash, rowIndex) => {
        return {
            ...localHash,
            [rowIndex]: removeNotSelected(hashWithoutUnselectedRows[rowIndex], startColumn, endColumn),
        };
    }, {} as T);
};

const getUpdatedCellHash = <T, THash extends BaseHash>(
    value: T, { row, column }: CellLocation, hash: THash, selectionRange: SelectionRange,
): THash => {
    const updatedHash = {
        ...hash,
        [row]: {
            ...(hash?.[row] ?? {}),
            [column]: value,
        },
    };

    return removeNotSelectedCells(updatedHash, selectionRange);
};

export function DataTableSelectionProvider({ children }: React.PropsWithChildren): React.ReactElement {
    const [selectionRange, setSelectionRange] = useState<SelectionRange>(null);
    const [selectedCells, setSelectedCells] = useState<SelectedCells>(null);
    const [selectedCellsActions, setSelectedCellsActions] = useState<SelectedCellsActions>(null);

    const setSelectionCells = <T,>(selection: CellSelection<T> | null, selectionRange: SelectionRange) => {
        if (!selection) {
            return;
        }
        const { value, onValueChange, onReplication, location } = selection;

        const startCellValue = selectionRange ? selectedCells?.[location.row]?.[location.column] ?? null : null;
        const isStartCell = selectionRange.startColumnIndex === location.column && selectionRange.startRowIndex === location.row;
        const newSelectedCells = getUpdatedCellHash(
            {
                originalValue: value,
                replicatedValue: isStartCell ? value : onReplication?.(value, { startCellValue: startCellValue as T, selectionRange, selectedCells }),
            },
            location,
            selectedCells,
            selectionRange,
        );
        setSelectedCells(newSelectedCells);

        const newSelectedCellsActions = getUpdatedCellHash({ onValueChange, onReplication }, location, selectedCellsActions, selectionRange);
        setSelectedCellsActions(newSelectedCellsActions);
    };

    const setSelection: SelectionContextState['setSelection'] = (selection, newSelectionRange) => {
        setSelectionRange((prevState) => {
            if (typeof newSelectionRange === 'function') {
                const newState = newSelectionRange(prevState);
                setSelectionCells(selection, newState);
                return newState;
            }

            setSelectionCells(selection, newSelectionRange);
            return newSelectionRange;
        });
    };

    const value = useMemo<SelectionContextState>(() => (
        { selectionRange, setSelection, selectedCells, selectedCellsActions }
    ), [selectionRange, selectedCells, selectedCellsActions]);


    useEffect(() => {
        if (!selectionRange) {
            return;
        }

        const handlePointerUp = () => {
            Object.keys(selectedCells).forEach((row) => {
                Object.keys(selectedCells[row]).forEach((column) => {
                    selectedCellsActions[row][column].onValueChange(selectedCells[row][column].replicatedValue);
                });
            });
            setSelectionRange(null);
        };

        document.addEventListener('pointerup', handlePointerUp);
        return () => document.removeEventListener('pointerup', handlePointerUp);
    }, [selectionRange]);

    return <DataTableSelectionContext.Provider value={ value }>{ children }</DataTableSelectionContext.Provider>;
}
