import { convertToBaseCellData, getCell, getCellToCopyFrom, getNormalizedLimits } from "../selection";
import { Lens } from "../../data/lenses";
import { rowsMock, columnsMock } from '../../mocks';

describe('getNormalizedLimits', () => {
    it('should return normalized limits', () => {
        expect(getNormalizedLimits(0, 100)).toEqual([0, 100]);
        expect(getNormalizedLimits(100, 0)).toEqual([0, 100]);
        expect(getNormalizedLimits(0, 0)).toEqual([0, 0]);
    });
});

describe('convertToBaseCellData', () => {
    it('should convert cell data to base cell data', () => {
        const baseCellData = {
            key: 'someKey',
            columnIndex: 0,
            rowIndex: 0,
            rowLens: Lens.onEditable({ value: {}, onValueChange: () => {} }),
        };

        expect(convertToBaseCellData({ ...baseCellData, canCopy: () => true, canAcceptCopy: () => true }))
            .toEqual(baseCellData);
    });
});

describe('getCell', () => {
    it('should get cell by coordinates', () => {
        const { rowLens, ...cell } = getCell(1, 1, rowsMock, columnsMock);
        const expectedColumn = columnsMock[1];
        const expectedRow = rowsMock[1];

        expect(cell).toEqual({
            key: expectedColumn.key,
            columnIndex: 1,
            rowIndex: 1,
            canCopy: expectedColumn.canCopy,
            canAcceptCopy: expectedColumn.canAcceptCopy,
        });
        expect(rowLens).toBeDefined();
        expect(typeof rowLens === 'object').toBeTruthy();
        expect(rowLens.get()).toEqual(expectedRow.value);
    });

    it('should return null if out of range', () => {
        expect(getCell(rowsMock.length, 1, rowsMock, columnsMock)).toBeNull();
        expect(getCell(1, columnsMock.length, rowsMock, columnsMock)).toBeNull();
    });
});

describe('getCellToCopyFrom', () => {
    it('should find a cell to copy from by coordinates', () => {
        const copyCellColumn = 0;
        const copyCellRow = 1;
        const expectedColumn = columnsMock[copyCellColumn];
        const expectedRow = rowsMock[copyCellRow];
        const selectionRange = { startColumnIndex: copyCellColumn, startRowIndex: copyCellRow, endColumnIndex: 1, endRowIndex: 2 };

        const { rowLens, ...copyCell } = getCellToCopyFrom(selectionRange, rowsMock, columnsMock);
        expect(copyCell).toEqual({
            key: expectedColumn.key,
            columnIndex: copyCellColumn,
            rowIndex: copyCellRow,
            canCopy: expectedColumn.canCopy,
            canAcceptCopy: expectedColumn.canAcceptCopy,
        });
        expect(rowLens).toBeDefined();
        expect(typeof rowLens === 'object').toBeTruthy();
        expect(rowLens.get()).toEqual(expectedRow.value);
    });

    it('should return null if no cell was selected', () => {
        expect(getCellToCopyFrom(null, rowsMock, columnsMock)).toBeNull();
    });
});

