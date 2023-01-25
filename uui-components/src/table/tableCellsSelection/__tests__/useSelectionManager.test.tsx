import { act } from "react-dom/test-utils";
import { renderHook } from '@testing-library/react-hooks';
import { useSelectionManager } from '../hooks';
import { columnsMock, rowsMock } from '../mocks';

const waitFor = async () => new Promise((resolve) => setTimeout(resolve, 0));

describe('useSelectioManager', () => {
    describe('selectRange', () => {
        it('should select some range', async () => {
            const { result } = renderHook(() => useSelectionManager({ rows: rowsMock, columns: columnsMock }));
            const newSelectionRange = { startColumnIndex: 0, startRowIndex: 0, endColumnIndex: 1, endRowIndex: 1, isCopying: true };
            await act(async () => {
                result.current.setSelectionRange(newSelectionRange);
                await waitFor();
            });

            expect(result.current.selectionRange).toEqual(newSelectionRange);

            await act(async () => {
                result.current.setSelectionRange(null);
                await waitFor();
            });

            expect(result.current.selectionRange).toEqual(null);
        });
    });

    describe('cellToCopyFrom', () => {
        it('should return cell to copy from', async () => {
            const { result } = renderHook(() => useSelectionManager({ rows: rowsMock, columns: columnsMock }));
            const newSelectionRange = { startColumnIndex: 1, startRowIndex: 1, endColumnIndex: 1, endRowIndex: 5, isCopying: true };
            await act(async () => {
                result.current.setSelectionRange(newSelectionRange);
                await waitFor();
            });


            const expectedColumn = columnsMock[newSelectionRange.startColumnIndex];
            const expectedRow = rowsMock[newSelectionRange.startRowIndex];

            expect(result.current.selectionRange).toEqual(newSelectionRange);
            expect(result.current.cellToCopyFrom).toBeDefined();
            const { column, row } = result.current.cellToCopyFrom;

            expect(column).toEqual(expectedColumn);
            expect(row).toEqual(expectedRow);
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
            expect(result.current.canBeSelected(2, 3, { copyFrom: true })).toBeFalsy();
        });

        it('should return true if copyTo flag is set and canAcceptCopy return true', async () => {
            const { result } = renderHook(() => useSelectionManager({ rows: rowsMock, columns: columnsMock }));
            const newSelectionRange = { startColumnIndex: 1, startRowIndex: 1, endColumnIndex: 1, endRowIndex: 5, isCopying: true };
            await act(async () => {
                result.current.setSelectionRange(newSelectionRange);
                await waitFor();
            });

            expect(result.current.canBeSelected(2, 1, { copyTo: true })).toBeTruthy();
        });

        it('should return false if copyTo flag is set and canAcceptCopy return false', async () => {
            const { result } = renderHook(() => useSelectionManager({ rows: rowsMock, columns: columnsMock }));
            const newSelectionRange = { startColumnIndex: 1, startRowIndex: 1, endColumnIndex: 1, endRowIndex: 3, isCopying: true };
            await act(async () => {
                result.current.setSelectionRange(newSelectionRange);
                await waitFor();
            });


            expect(result.current.canBeSelected(1, 0, { copyTo: true })).toBeFalsy();
        });

        it('should return false if copyTo flag is set and no cell to copy was selected', () => {
            const { result } = renderHook(() => useSelectionManager({ rows: rowsMock, columns: columnsMock }));
            expect(result.current.canBeSelected(2, 0, { copyTo: true })).toBeFalsy();
        });
    });


    describe('getSelectedCells', () => {
        it('should return selected range', async () => {
            const { result } = renderHook(() => useSelectionManager({ rows: rowsMock, columns: columnsMock }));
            const newSelectionRange = { startColumnIndex: 0, startRowIndex: 0, endColumnIndex: 1, endRowIndex: 3, isCopying: true };
            await act(async () => {
                result.current.setSelectionRange(newSelectionRange);
                await waitFor();
            });


            expect(result.current.getSelectedCells()).toEqual([
                { column: columnsMock[0], row: rowsMock[0] },
                { column: columnsMock[1], row: rowsMock[0] },
                { column: columnsMock[1], row: rowsMock[1] },
                { column: columnsMock[0], row: rowsMock[2] },
                { column: columnsMock[1], row: rowsMock[2] },
                { column: columnsMock[1], row: rowsMock[3] },
            ]);
        });

        it('should return null if selected range', () => {
            const { result } = renderHook(() => useSelectionManager({ rows: rowsMock, columns: columnsMock }));
            expect(result.current.getSelectedCells()).toEqual([]);
        });
    });



    describe('useCellSelectionInfo', () => {
        const selectionRange = { startColumnIndex: 0, startRowIndex: 0, endColumnIndex: 2, endRowIndex: 3, isCopying: true };
        it('should render borders for start cell', async () => {
            const { result } = renderHook(() => useSelectionManager({ rows: rowsMock, columns: columnsMock }));
            await act(async () => {
                result.current.setSelectionRange(selectionRange);
                await waitFor();
            });

            const { result: infoResult } = renderHook(() => result.current.useCellSelectionInfo(0, 0));
            expect(infoResult.current).toEqual({
                isSelected: true, showTopBorder: true, showRightBorder: true, showBottomBorder: true, showLeftBorder: true, canCopyFrom: true,
                canAcceptCopy: true,
            });
        });

        it('should render border for cell near border', async () => {
            const { result } = renderHook(() => useSelectionManager({ rows: rowsMock, columns: columnsMock }));
            await act(async () => {
                result.current.setSelectionRange(selectionRange);
                await waitFor();
            });

            const { result: infoResult } = renderHook(() => result.current.useCellSelectionInfo(0, 2));
            expect(infoResult.current).toEqual({
                isSelected: true, showTopBorder: true, showRightBorder: true, canCopyFrom: true, canAcceptCopy: true,
                showBottomBorder: false, showLeftBorder: false,
            });

            const { result: infoResult2 } = renderHook(() => result.current.useCellSelectionInfo(3, 1));
            expect(infoResult2.current).toEqual({
                isSelected: true, showBottomBorder: true, showLeftBorder: true, canCopyFrom: true, canAcceptCopy: true,
                showTopBorder: false, showRightBorder: false,
            });
        });

        it('should not render borders for cell inside the area of selection', async () => {
            const { result } = renderHook(() => useSelectionManager({ rows: rowsMock, columns: columnsMock }));
            await act(async () => {
                result.current.setSelectionRange(selectionRange);
                await waitFor();
            });

            const { result: infoResult2 } = renderHook(() => result.current.useCellSelectionInfo(2, 1));
            expect(infoResult2.current).toEqual({
                isSelected: true, canCopyFrom: true, canAcceptCopy: true,
                showTopBorder: false, showRightBorder: false, showBottomBorder: false, showLeftBorder: false,
            });
        });
    });
});
