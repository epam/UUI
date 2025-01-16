import { renderHook, act } from '@epam/uui-test-utils';
import { useSelectionManager } from '../hooks';
import { columnsMock, rowsByIndexMock } from '../mocks';

describe('useSelectioManager', () => {
    describe('selectRange', () => {
        it('should select some range', async () => {
            const { result } = renderHook(() => useSelectionManager({ rowsByIndex: rowsByIndexMock, columns: columnsMock }));
            const newSelectionRange = {
                startColumnIndex: 0, startRowIndex: 0, endColumnIndex: 1, endRowIndex: 1, isCopying: true,
            };
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

    describe('startCell', () => {
        it('should return cell to copy from', async () => {
            const { result } = renderHook(() => useSelectionManager({ rowsByIndex: rowsByIndexMock, columns: columnsMock }));
            const newSelectionRange = {
                startColumnIndex: 1, startRowIndex: 1, endColumnIndex: 1, endRowIndex: 5, isCopying: true,
            };
            act(() => {
                result.current.setSelectionRange(newSelectionRange);
            });

            const expectedColumn = columnsMock[newSelectionRange.startColumnIndex];
            const expectedRow = rowsByIndexMock.get(newSelectionRange.startRowIndex);

            expect(result.current.selectionRange).toEqual(newSelectionRange);
            expect(result.current.startCell).toBeDefined();
            const { column, row } = result.current.startCell;

            expect(column).toEqual(expectedColumn);
            expect(row).toEqual(expectedRow);
        });
        it('should null if selection range was not set', () => {
            const { result } = renderHook(() => useSelectionManager({ rowsByIndex: rowsByIndexMock, columns: columnsMock }));

            expect(result.current.selectionRange).toBeNull();
            expect(result.current.startCell).toBeNull();
        });
    });

    describe('getSelectedCells', () => {
        it('should return selected range', async () => {
            const { result } = renderHook(() => useSelectionManager({ rowsByIndex: rowsByIndexMock, columns: columnsMock }));
            const newSelectionRange = {
                startColumnIndex: 0, startRowIndex: 0, endColumnIndex: 1, endRowIndex: 3, isCopying: true,
            };
            act(() => {
                result.current.setSelectionRange(newSelectionRange);
            });

            expect(result.current.getSelectedCells()).toEqual([
                { column: columnsMock[0], row: rowsByIndexMock.get(0) },
                { column: columnsMock[1], row: rowsByIndexMock.get(0) },
                { column: columnsMock[1], row: rowsByIndexMock.get(1) },
                { column: columnsMock[0], row: rowsByIndexMock.get(2) },
                { column: columnsMock[1], row: rowsByIndexMock.get(2) },
                { column: columnsMock[1], row: rowsByIndexMock.get(3) },
            ]);
        });

        it('should return null if selected range', () => {
            const { result } = renderHook(() => useSelectionManager({ rowsByIndex: rowsByIndexMock, columns: columnsMock }));
            expect(result.current.getSelectedCells()).toEqual([]);
        });
    });

    describe('useCellSelectionInfo', () => {
        const selectionRange = {
            startColumnIndex: 0, startRowIndex: 0, endColumnIndex: 2, endRowIndex: 3, isCopying: true,
        };
        it('should render borders for start cell', async () => {
            const { result } = renderHook(() => useSelectionManager({ rowsByIndex: rowsByIndexMock, columns: columnsMock }));
            act(() => {
                result.current.setSelectionRange(selectionRange);
            });

            expect(result.current.getCellSelectionInfo(0, 0)).toEqual({
                isSelected: true,
                showTopBorder: true,
                showRightBorder: true,
                showBottomBorder: true,
                showLeftBorder: true,
                canCopyFrom: true,
                canAcceptCopy: true,
                isStartCell: true,
            });
        });

        it('should render border for cell near border', async () => {
            const { result } = renderHook(() => useSelectionManager({ rowsByIndex: rowsByIndexMock, columns: columnsMock }));
            act(() => {
                result.current.setSelectionRange(selectionRange);
            });

            expect(result.current.getCellSelectionInfo(0, 2)).toEqual({
                isSelected: true,
                showTopBorder: true,
                showRightBorder: true,
                canCopyFrom: true,
                canAcceptCopy: true,
                showBottomBorder: false,
                showLeftBorder: false,
                isStartCell: false,
            });

            expect(result.current.getCellSelectionInfo(3, 1)).toEqual({
                isSelected: true,
                showBottomBorder: true,
                showLeftBorder: true,
                canCopyFrom: true,
                canAcceptCopy: true,
                showTopBorder: false,
                showRightBorder: false,
                isStartCell: false,
            });
        });

        it('should not render borders for cell inside the area of selection', async () => {
            const { result } = renderHook(() => useSelectionManager({ rowsByIndex: rowsByIndexMock, columns: columnsMock }));
            act(() => {
                result.current.setSelectionRange(selectionRange);
            });

            expect(result.current.getCellSelectionInfo(2, 1)).toEqual({
                isSelected: true,
                canCopyFrom: true,
                canAcceptCopy: true,
                showTopBorder: false,
                showRightBorder: false,
                showBottomBorder: false,
                showLeftBorder: false,
                isStartCell: false,
            });
        });
    });
});
