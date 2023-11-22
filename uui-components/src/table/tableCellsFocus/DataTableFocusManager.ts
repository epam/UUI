import { CellInfo, DataTableFocusManagerProps, RowsRegistry } from './types';

export class DataTableFocusManager<TId> {
    private rowsRegistry: RowsRegistry<TId> = null;
    private pendingRowToBeFocused?: TId;
    private focusedRow?: TId;
    private focusedCell?: number;

    constructor(props: DataTableFocusManagerProps) {
        this.rowsRegistry = new Map();
    }

    public focusRow(id: TId) {
        const rowKey = this.getKeyById(id);
        if (!this.rowsRegistry.has(rowKey)) {
            this.setPendingFocusRow(id);
            return;
        }

        const row = this.rowsRegistry.get(rowKey);

        const firstFocusableCell = row.find((cell) => this.isFocusableCell(cell));
        if (!firstFocusableCell) return;

        firstFocusableCell.ref.current.focus();
        this.setNewFocusCoordinates(id, firstFocusableCell.cellProps.index);
        this.unsetPendingFocusRow();
    }

    public setNewFocusCoordinates(focusedRow: TId, focusedCell: number) {
        this.focusedRow = focusedRow;
        this.focusedCell = focusedCell;
    }

    public focusNextCell() {}

    public focusPrevCell() {}

    public focusNextRow() {}

    public focusPrevRow() {}

    public registerCell(id: TId, ref: CellInfo['ref'], cellProps: CellInfo['cellProps']) {
        const rowKey = this.getKeyById(id);
        if (!this.rowsRegistry.has(rowKey)) {
            this.rowsRegistry.set(rowKey, []);
        }

        const row = this.rowsRegistry.get(rowKey);
        const cell = { ref, cellProps };
        row[cellProps.index] = cell;

        if (this.pendingRowToBeFocused === id && this.isFocusableCell(cell)) {
            this.focusRow(id);
        }
    }

    public unregisterCell(id: TId, index: number) {
        const rowKey = this.getKeyById(id);
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
}
