import { getCell, getCellToCopyFrom, getNormalizedLimits } from "../helpers";
import { rowsMock, columnsMock } from '../../mocks';

describe('getNormalizedLimits', () => {
    it('should return normalized limits', () => {
        expect(getNormalizedLimits(0, 100)).toEqual([0, 100]);
        expect(getNormalizedLimits(100, 0)).toEqual([0, 100]);
        expect(getNormalizedLimits(0, 0)).toEqual([0, 0]);
    });
});

describe('getCell', () => {
    it('should get cell by coordinates', () => {
        const { row, column } = getCell(1, 1, rowsMock, columnsMock);
        const expectedColumn = columnsMock[1];
        const expectedRow = rowsMock[1];

        expect(column).toEqual(expectedColumn);
        expect(row).toEqual(expectedRow);
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

        const { column, row } = getCellToCopyFrom(selectionRange, rowsMock, columnsMock);
        expect(column).toEqual(expectedColumn);
        expect(row).toEqual(expectedRow);
    });

    it('should return null if no cell was selected', () => {
        expect(getCellToCopyFrom(null, rowsMock, columnsMock)).toBeNull();
    });
});

