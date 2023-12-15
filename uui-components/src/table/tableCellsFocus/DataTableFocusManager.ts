import { CellProps, RowInfo, RowsRegistry } from './types';

export class DataTableFocusManager<TId> {
    private rowsRegistry: RowsRegistry<TId> = null;
    private rowsIndexToIds: Map<number, TId> = null;

    private pendingRowToBeFocused?: TId;
    private focusedRow?: TId;
    private focusedCell?: number;
    private lastRowIndex?: number;

    constructor() {
        this.rowsRegistry = new Map();
        this.rowsIndexToIds = new Map();
    }

    public focusRow(id: TId) {
        const rowKey = this.getKeyById(id);
        if (!this.rowsRegistry.has(rowKey)) {
            this.setPendingFocusRow(id);
            return;
        }

        const row = this.rowsRegistry.get(rowKey);

        if (this.focusedCell !== undefined && this.isFocusableCell(row[this.focusedCell])) {
            const cell = row[this.focusedCell];
            cell.focus();
            this.setNewFocusCoordinates(id, cell.index);
            this.unsetPendingFocusRow();
            return;
        }

        this.focusNextFocusableCell(id);
    }

    private focusNextFocusableCell(id: TId) {
        const rowKey = this.getKeyById(id);
        const row = this.rowsRegistry.get(rowKey);
        const firstFocusableCell = row.find((cell) => this.isFocusableCell(cell));
        if (firstFocusableCell) {
            firstFocusableCell.focus();
            this.setNewFocusCoordinates(id, firstFocusableCell.index);
            this.unsetPendingFocusRow();
        }
    }

    public setNewFocusCoordinates(focusedRow: TId, focusedCell: number) {
        this.focusedRow = focusedRow;
        this.focusedCell = focusedCell;
    }

    public focusNextRow() {
        const currentFocusedRowIndex = this.currentFocusedRowIndex();
        if (currentFocusedRowIndex === undefined || currentFocusedRowIndex === -1) {
            this.moveToNextFocusableRow(0);
            return;
        }

        const nextRowIndex = currentFocusedRowIndex + 1;
        this.moveToNextFocusableRow(nextRowIndex);
    }

    public focusPrevRow() {
        const currentFocusedRowIndex = this.currentFocusedRowIndex();
        if (this.focusedRow === undefined || currentFocusedRowIndex === -1) {
            this.moveToPrevFocusableRow(0);
            return;
        }

        const prevRowIndex = currentFocusedRowIndex - 1;
        this.moveToPrevFocusableRow(prevRowIndex);
    }

    private moveToNextFocusableRow(startingFromIndex: number) {
        if (this.hasRowWithIndex(startingFromIndex) && this.isFocusableRow(this.getRowIdByIndex(startingFromIndex))) {
            this.focusRow(this.getRowIdByIndex(startingFromIndex));
            return;
        }

        const indexes = [...this.rowsIndexToIds.keys()];
        const nextIndexes = indexes.slice(startingFromIndex, indexes.length);
        const focused = this.focusToNextFocusableRow(nextIndexes);

        if (!focused) {
            const prevIndexes = indexes.slice(0, startingFromIndex);
            this.focusToNextFocusableRow(prevIndexes);
        }
    }

    private moveToPrevFocusableRow(startingFromIndex: number) {
        if (this.hasRowWithIndex(startingFromIndex) && this.isFocusableRow(this.getRowIdByIndex(startingFromIndex))) {
            this.focusRow(this.getRowIdByIndex(startingFromIndex));
            return;
        }

        const indexes = [...this.rowsIndexToIds.keys()];
        const fromIndex = startingFromIndex === -1 ? undefined : startingFromIndex;
        const prevIndexes = indexes.slice(0, fromIndex).reverse();
        const focused = this.focusToNextFocusableRow(prevIndexes);

        if (!focused) {
            const nextIndexes = indexes.slice(startingFromIndex, indexes.length).reverse();
            this.focusToNextFocusableRow(nextIndexes);
        }
    }

    public registerCell(rowInfo: RowInfo<TId>, cellProps: CellProps) {
        const rowKey = this.getKeyById(rowInfo.id);

        this.setRowIdByIndex(rowInfo.index, rowInfo.id);
        if (!this.rowsRegistry.has(rowKey)) {
            this.rowsRegistry.set(rowKey, []);
        }

        if (this.lastRowIndex === undefined || this.lastRowIndex < rowInfo.index) {
            this.lastRowIndex = rowInfo.index;
        }
        const row = this.rowsRegistry.get(rowKey);
        row[cellProps.index] = cellProps;

        if (this.pendingRowToBeFocused === rowInfo.id && this.isFocusableCell(cellProps)) {
            this.focusRow(rowInfo.id);
        }
    }

    public unregisterCell(id: TId, index: number) {
        if (index === undefined || id === undefined) return;

        const rowKey = this.getKeyById(id);
        const rowIndex = this.findRowIndexById(id);
        if (rowIndex !== -1) {
            this.deleteRowIdByIndex(rowIndex);
        }
        if (!this.rowsRegistry.has(rowKey)) return;

        const row = this.rowsRegistry.get(rowKey);
        delete row[index];
    }

    private focusToNextFocusableRow(indexes: number[]) {
        const nextFocusableRowIndex = indexes.find(
            (nextIndex) =>this.isFocusableRow(this.getRowIdByIndex(nextIndex)),
        );

        if (nextFocusableRowIndex !== undefined) {
            this.focusRow(this.getRowIdByIndex(nextFocusableRowIndex));
            return true;
        }
        return false;
    }

    private getKeyById = (id: TId) => {
        if (id != null && typeof id === 'object') {
            return JSON.stringify(id);
        }
        return id;
    };

    private setPendingFocusRow(id: TId) {
        this.pendingRowToBeFocused = id;
    }

    private unsetPendingFocusRow() {
        this.pendingRowToBeFocused = null;
    }

    private isFocusableRow = (id: TId) => {
        const rowKey = this.getKeyById(id);
        const row = this.rowsRegistry.get(rowKey);
        return row.some((cell) => this.isFocusableCell(cell));
    };

    private isFocusableCell = (cellProps?: CellProps) =>
        cellProps && !cellProps.isDisabled && !cellProps.isReadonly;

    private findRowIndexById(id: TId) {
        for (const [index, rowId] of this.rowsIndexToIds.entries()) {
            if (this.getKeyById(rowId) === this.getKeyById(id)) {
                return index;
            }
        }
        return -1;
    }

    private hasRowWithIndex(index: number) {
        return this.rowsIndexToIds.has(index);
    }

    private getRowIdByIndex(index: number) {
        return this.rowsIndexToIds.get(index);
    }

    private setRowIdByIndex(index: number, id: TId) {
        return this.rowsIndexToIds.set(index, id);
    }

    private deleteRowIdByIndex(index: number) {
        return this.rowsIndexToIds.delete(index);
    }

    private currentFocusedRowIndex() {
        return this.focusedRow !== undefined
            ? this.findRowIndexById(this.focusedRow)
            : undefined;
    }
}
