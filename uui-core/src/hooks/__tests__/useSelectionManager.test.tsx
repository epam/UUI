import React from 'react';
import { act } from "react-dom/test-utils";
import { renderHook } from '@testing-library/react-hooks';
import { useSelectionManager } from '../useSelectionManager';
import { columnsMock, rowsMock } from '../../mocks';

describe('useSelectioManager', () => {
    describe('selectRange', () => {
        it('should select some range', () => {
            const { result } = renderHook(() => useSelectionManager({ rows: rowsMock, columns: columnsMock }));
            const newSelectionRange = { startColumnIndex: 0, startRowIndex: 0, endColumnIndex: 1, endRowIndex: 1, isCopying: true };
            act(() => {
                result.current.setSelectionRange(newSelectionRange);
            });

            expect(result.current.selectionRange).toEqual(newSelectionRange);

            act(() => {
                result.current.setSelectionRange(null);
            });

            expect(result.current.selectionRange).toEqual(null);
        });
    });

    describe('cellToCopyFrom', () => {
        it('should return cell to copy from', () => {
            const { result } = renderHook(() => useSelectionManager({ rows: rowsMock, columns: columnsMock }));
            const newSelectionRange = { startColumnIndex: 1, startRowIndex: 1, endColumnIndex: 1, endRowIndex: 5, isCopying: true };
            act(() => {
                result.current.setSelectionRange(newSelectionRange);
            });

            const expectedColumn = columnsMock[newSelectionRange.startColumnIndex];
            const expectedRow = rowsMock[newSelectionRange.startRowIndex];

            expect(result.current.selectionRange).toEqual(newSelectionRange);
            expect(result.current.cellToCopyFrom).toBeDefined();
            const { rowLens, ...cell } = result.current.cellToCopyFrom;

            expect(cell).toEqual({
                columnIndex: newSelectionRange.startColumnIndex,
                key: expectedColumn.key,
                rowIndex: newSelectionRange.startRowIndex,
            });

            expect(rowLens.get()).toEqual(expectedRow.value);
        });
        it('should null if selection range was not set', () => {
            const { result } = renderHook(() => useSelectionManager({ rows: rowsMock, columns: columnsMock }));

            expect(result.current.selectionRange).toBeNull();
            expect(result.current.cellToCopyFrom).toBeNull();
        });
    });

    describe('canBeSelected', () => {
        it('should return true if copyFrom flag is set and canCopy return true', () => {
            const { result } = renderHook(() => useSelectionManager({ rows: rowsMock, columns: columnsMock }));
            expect(result.current.canBeSelected(2, 0, { copyFrom: true })).toBeTruthy();
        });

        it('should return false if copyFrom flag is set and canCopy return false', () => {
            const { result } = renderHook(() => useSelectionManager({ rows: rowsMock, columns: columnsMock }));
            expect(result.current.canBeSelected(2, 1, { copyFrom: true })).toBeFalsy();
        });

        it('should return true if copyTo flag is set and canAcceptCopy return true', () => {
            const { result } = renderHook(() => useSelectionManager({ rows: rowsMock, columns: columnsMock }));
            const newSelectionRange = { startColumnIndex: 1, startRowIndex: 1, endColumnIndex: 1, endRowIndex: 5, isCopying: true };
            act(() => {
                result.current.setSelectionRange(newSelectionRange);
            });

            expect(result.current.canBeSelected(2, 1, { copyTo: true })).toBeTruthy();
        });

        it('should return false if copyTo flag is set and canAcceptCopy return false', () => {
            const { result } = renderHook(() => useSelectionManager({ rows: rowsMock, columns: columnsMock }));
            const newSelectionRange = { startColumnIndex: 1, startRowIndex: 1, endColumnIndex: 1, endRowIndex: 3, isCopying: true };
            act(() => {
                result.current.setSelectionRange(newSelectionRange);
            });

            expect(result.current.canBeSelected(1, 0, { copyTo: true })).toBeFalsy();
        });

        it('should return false if copyTo flag is set and no cell to copy was selected', () => {
            const { result } = renderHook(() => useSelectionManager({ rows: rowsMock, columns: columnsMock }));
            expect(result.current.canBeSelected(2, 0, { copyTo: true })).toBeFalsy();
        });
    });


    describe('getSelectedCells', () => {
        it('should return selected range', () => {
            const { result } = renderHook(() => useSelectionManager({ rows: rowsMock, columns: columnsMock }));
            const newSelectionRange = { startColumnIndex: 0, startRowIndex: 0, endColumnIndex: 1, endRowIndex: 3, isCopying: true };
            act(() => {
                result.current.setSelectionRange(newSelectionRange);
            });

            const cells = result.current.getSelectedCells();
            const selectedCells = cells.map(({ rowLens, ...cell }) => cell);

            expect(selectedCells).toEqual([
                { columnIndex: 0, key: "age", rowIndex: 0 },
                { columnIndex: 1, key: "salary", rowIndex: 0 },
                { columnIndex: 1, key: "salary", rowIndex: 1 },
                { columnIndex: 0, key: "age", rowIndex: 2 },
                { columnIndex: 1, key: "salary", rowIndex: 2 },
                { columnIndex: 1, key: "salary", rowIndex: 3 },
            ]);
            expect(cells.map(({ rowLens }) => rowLens.get())).toEqual([
                rowsMock[0].value,
                rowsMock[0].value,
                rowsMock[1].value,
                rowsMock[2].value,
                rowsMock[2].value,
                rowsMock[3].value,
            ]);
        });

        it('should return null if selected range', () => {
            const { result } = renderHook(() => useSelectionManager({ rows: rowsMock, columns: columnsMock }));
            expect(result.current.getSelectedCells()).toEqual([]);
        });
    });

});
