import { CellInfo, DataTableFocusManagerProps, RowInfo, RowsRegistry } from './types';

export class DataTableFocusManager<TId> {
    private rowsRegistry: RowsRegistry<TId> = null;
    private rowsIndexToIds: Map<number, TId> = null;

    private pendingRowToBeFocused?: TId;
    private focusedRow?: TId;
    private focusedCell?: number;
    private lastRowIndex?: number;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(props: DataTableFocusManagerProps) {
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

        if (this.focusedCell !== undefined && row[this.focusedCell]) {
            const cell = row[this.focusedCell];
            if (cell && this.isFocusableCell(cell)) {
                cell.ref.current.focus();
                this.setNewFocusCoordinates(id, cell.cellProps.index);
            }
        } else {
            const firstFocusableCell = row.find((cell) => this.isFocusableCell(cell));
            if (!firstFocusableCell) return;
            firstFocusableCell.ref.current.focus();
            this.setNewFocusCoordinates(id, firstFocusableCell.cellProps.index);
        }

        this.unsetPendingFocusRow();
    }

    public setNewFocusCoordinates(focusedRow: TId, focusedCell: number) {
        this.focusedRow = focusedRow;
        this.focusedCell = focusedCell;
    }

    public focusNextRow() {
        const currentRowFocusIndex = this.focusedRow !== undefined
            ? this.findRowIndexById(this.focusedRow)
            : undefined;
        const nextRowIndex = currentRowFocusIndex + 1;

        if (currentRowFocusIndex === undefined || currentRowFocusIndex === -1 || !this.hasRowWithIndex(nextRowIndex)) {
            if (this.hasRowWithIndex(0)) {
                this.focusRow(this.getRowIdByIndex(0));
            }
            return;
        }

        this.focusRow(this.getRowIdByIndex(nextRowIndex));
    }

    public focusPrevRow() {
        const currentRowFocusIndex = this.focusedRow !== undefined
            ? this.findRowIndexById(this.focusedRow)
            : undefined;
        const prevRowIndex = currentRowFocusIndex - 1;

        if (this.focusedRow === undefined || currentRowFocusIndex === -1) {
            if (this.hasRowWithIndex(0)) {
                this.focusRow(this.getRowIdByIndex(0));
            }
            return;
        }
        if (prevRowIndex < 0) {
            const lastRowId = this.getRowIdByIndex(this.getLastRowIndex());
            this.focusRow(lastRowId);
            return;
        }
        this.focusRow(this.getRowIdByIndex(prevRowIndex));
    }

    public registerCell(rowInfo: RowInfo<TId>, ref: CellInfo['ref'], cellProps: CellInfo['cellProps']) {
        const rowKey = this.getKeyById(rowInfo.id);

        this.setRowIdByIndex(rowInfo.index, rowInfo.id);
        if (!this.rowsRegistry.has(rowKey)) {
            this.rowsRegistry.set(rowKey, []);
        }

        if (this.lastRowIndex === undefined || this.lastRowIndex < rowInfo.index) {
            this.lastRowIndex = rowInfo.index;
        }
        const row = this.rowsRegistry.get(rowKey);
        const cell = { ref, cellProps };
        row[cellProps.index] = cell;

        if (this.pendingRowToBeFocused === rowInfo.id && this.isFocusableCell(cell)) {
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

    private isFocusableCell = (cell?: CellInfo) =>
        cell && !cell.cellProps.isDisabled && !cell.cellProps.isReadonly;

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

    private getLastRowIndex() {
        return this.lastRowIndex;
    }
}
