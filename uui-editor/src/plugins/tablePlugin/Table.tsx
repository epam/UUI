import * as React from 'react';
import * as css from './Table.scss';
import * as ReactDOM from "react-dom";
import { Broadcast } from 'react-broadcast';
import { mouseCoords } from '@epam/uui';
import { RenderBlockProps } from 'slate-react';
import { MergeCellBar } from '../../implementation/MergeCellBar';
import { TableBar } from '../../implementation/TableBar';

type cellInfo = {
    cellIndex: number;
    rowIndex?: number;
    width?: number;
    isHover?: boolean;
};

type selectingInfo = {
    cellNumber: number;
    rowNumber: number;
};

interface TableState {
    isBorderMoving: boolean;
    isCellSelecting: boolean;
    isTextSelectingForbiden: boolean;
    mouseDownX: number;
    currentCell: cellInfo;
    firstSelectedCell: selectingInfo;
    nextCell: cellInfo;
    hoverCellIndex: number;
    selectedCells: any[];
}

const MIN_CELL_WIDTH = 60;
const DEFAULT_CELL_WIDTH = 200;
const DEFAULT_COLUMNS = [DEFAULT_CELL_WIDTH, DEFAULT_CELL_WIDTH];

export class Table extends React.Component<RenderBlockProps, TableState> {
    state: TableState = {
        isBorderMoving: false,
        isCellSelecting: false,
        isTextSelectingForbiden: false,
        mouseDownX: 0,
        currentCell: {
            cellIndex: null,
            rowIndex: null,
        },
        firstSelectedCell: null,
        nextCell: null,
        hoverCellIndex: null,
        selectedCells: [this.props.editor.value.anchorBlock],
    };
    tableNode: any = null;
    tableWrapperNode: any = null;

    constructor (props: any) {
        super(props);
    }

    componentDidMount() {
        window.addEventListener('mouseup', this.windowMouseUpHandler);
        this.tableWrapperNode.addEventListener('mousemove', this.windowMouseMoveHandler);
        window.addEventListener('mousedown', this.windowMouseDownHandler);

        let cellInfo = this.props.node.data.get('cellSizes');
        if (!cellInfo) {
            this.setSize(DEFAULT_COLUMNS);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('mouseup', this.windowMouseUpHandler);
        this.tableWrapperNode.removeEventListener('mousemove', this.windowMouseMoveHandler);
        window.removeEventListener('mousedown', this.windowMouseDownHandler);
    }

    componentDidUpdate() {
        let newColumnCount = this.getColumnsCount();
        let cellInfo: any[] = this.props.node.data.get('cellSizes');
        if (newColumnCount != cellInfo.length) {
            if (newColumnCount > cellInfo.length) {
                let cellsWidth: number[] = [...this.props.node.data.get('cellSizes')].concat(MIN_CELL_WIDTH);
                this.setSize(cellsWidth);
            } else {
                let cellInfo: any[] = this.props.node.data.get('cellSizes');
                let cellsWidth: number[] = cellInfo.slice(cellInfo.length - 1);
                this.setState({ selectedCells: [this.props.editor.value.anchorBlock] });
                this.setSize(cellsWidth);
            }

        }
    }

    windowMouseUpHandler = (e: Event) => {
        if (this.props.editor.readOnly) {
            return;
        }

        if (this.state.isBorderMoving || this.state.isCellSelecting || this.state.isTextSelectingForbiden) {
            this.setState({ isBorderMoving: false, isCellSelecting: false, isTextSelectingForbiden: false });
        }
        const table: HTMLElement = ReactDOM.findDOMNode(this.tableNode) as any;
        table.style.userSelect = null;
        table.removeAttribute('contenteditable');

    }

    setSize = (data: any) => {
        const newData = this.props.node.data.set('cellSizes', data);
        this.props.editor.setNodeByKey(this.props.node.key, {
            ...this.props.node as any,
            data: newData,
        });
    }

    isCellsWidthValid = (curCellW: number, nextCellW: number) => {
        return curCellW > MIN_CELL_WIDTH && (nextCellW && (nextCellW > MIN_CELL_WIDTH) || nextCellW == null);
    }

    isMouseInsideTable = (e: any) => {
        return e.target.closest('table');
    }

    isTableWidthValid = () => {
        let tableSize = this.tableNode && this.tableNode.getBoundingClientRect() || {width: 0};
        const editorNode: HTMLElement = ReactDOM.findDOMNode(this.props.editor) as any;

        return tableSize.width < editorNode.getBoundingClientRect().width;
    }

    isSelectionMovedOnAnotherCell = (currentCell: any, currentRow: any) => {
        return currentCell && (currentCell.cellIndex !== this.state.currentCell.cellIndex || currentRow.rowIndex !== this.state.currentCell.rowIndex);
    }

    isSomeCellsSelected = (currentCell: any, currentRow: any) => {
        return currentCell && !this.state.isTextSelectingForbiden && (this.state.firstSelectedCell.cellNumber !== currentCell.cellIndex || this.state.firstSelectedCell.rowNumber !== currentRow.rowIndex);
    }

    forbidTextSelection = () => {
        this.setState({ isTextSelectingForbiden: true });
        window.getSelection().setPosition(this.tableNode);
        const table: HTMLElement = ReactDOM.findDOMNode(this.tableNode) as any;
        table.style.userSelect = 'none';
        table.setAttribute('contenteditable', 'false');
    }

    windowMouseMoveHandler = (e: MouseEvent) => {
        if (this.props.editor.readOnly) {
            return;
        }

        if (this.state.isBorderMoving) {
            let diff = this.state.mouseDownX - e.clientX;
            let curCellNewWidth = this.state.currentCell.width - diff;
            let nextCellNewWidth = this.state.nextCell ? this.state.nextCell.width + diff : null;

            if (this.isCellsWidthValid(curCellNewWidth, nextCellNewWidth)) {
                let newCellsWidth = [...this.props.node.data.get('cellSizes')];
                newCellsWidth[this.state.currentCell.cellIndex] = curCellNewWidth;
                if (this.state.nextCell) {
                    newCellsWidth[this.state.nextCell.cellIndex] = nextCellNewWidth;
                }

                this.setSize(newCellsWidth);
            }
        }

        if ((e.target as any).classList.contains('uui-richTextEditor-resize-border') && !this.state.isTextSelectingForbiden) {
            let currentCellColspan = (e.target as any).closest('td, th').getAttribute('colSpan');
            if (this.state.hoverCellIndex === null) {
                if (currentCellColspan > 1) {
                    this.setState({ hoverCellIndex: (e.target as any).parentElement.cellIndex + currentCellColspan - 1 });
                } else {
                    this.setState({ hoverCellIndex: (e.target as any).parentElement.cellIndex });
                }
            }
        } else {
            this.state.hoverCellIndex !== null && this.setState({ hoverCellIndex: null });
        }

        if (this.state.isCellSelecting) {
            let currentCell = (e.target as any).closest('td, th');
            let currentRow = (e.target as any).closest('tr');

            if (this.isSomeCellsSelected(currentCell, currentRow)) {
                this.forbidTextSelection();
            }

            if (this.isSelectionMovedOnAnotherCell(currentCell, currentRow)) {
                this.setState({
                    currentCell: {
                        cellIndex: currentCell.cellIndex,
                        rowIndex: currentRow.rowIndex,
                    },
                });

                let startColumnIndex = this.state.firstSelectedCell.cellNumber <= currentCell.cellIndex ? this.state.firstSelectedCell.cellNumber : currentCell.cellIndex;
                let startRowIndex = this.state.firstSelectedCell.rowNumber <= currentRow.rowIndex ? this.state.firstSelectedCell.rowNumber : currentRow.rowIndex;
                let endColumnIndex = this.state.firstSelectedCell.cellNumber > currentCell.cellIndex ? this.state.firstSelectedCell.cellNumber : currentCell.cellIndex;
                let endRowIndex = this.state.firstSelectedCell.rowNumber > currentRow.rowIndex ? this.state.firstSelectedCell.rowNumber : currentRow.rowIndex;

                let selectedCells: any = [];

                this.props.node.nodes.toArray().map((row: any, rowIndex: number) => {
                    let isRowInSelection = rowIndex >= startRowIndex && rowIndex <= endRowIndex;
                    isRowInSelection && row.nodes.toArray().map((cell: any, cellIndex: number) => {
                        let cellRowSpan = cell.data.get('rowSpan') || 1;
                        let cellColSpan = cell.data.get('colSpan') || 1;
                        let isCellInSelection = cellIndex >= startColumnIndex && cellIndex <= endColumnIndex;

                        if (isCellInSelection && cellRowSpan > 1 && endRowIndex < rowIndex + cellRowSpan - 1) {
                            endRowIndex = rowIndex + cellRowSpan - 1;
                        }
                        if (isCellInSelection && cellColSpan > 1 && endColumnIndex < cellIndex + cellColSpan - 1) {
                            endColumnIndex = cellIndex + cellColSpan - 1;
                        }
                    });
                });
                this.props.node.nodes.toArray().map((row: any, rowIndex: number) => {
                    let isRowInSelection = rowIndex >= startRowIndex && rowIndex <= endRowIndex;
                    isRowInSelection && row.nodes.toArray().map((cell: any, cellIndex: number) => {
                        let isCellInSelection = cellIndex >= startColumnIndex && cellIndex <= endColumnIndex;
                        isCellInSelection && selectedCells.push(cell);
                    });
                });

                this.setState({ selectedCells: selectedCells });
            }
        }

    }

    windowMouseDownHandler = (e: any) => {
        if (this.props.editor.readOnly) {
            return;
        }

        if (e.target.classList.contains('uui-richTextEditor-resize-border')) {
            e.preventDefault();

            let currentCell = e.target.closest('td, th');
            let currentCellColspan = currentCell.getAttribute('colSpan');
            if (currentCellColspan > 1) {
                for (let i = 1; i < currentCellColspan; i++) {
                    currentCell = currentCell.nextElementSibling;
                }
            }
            let nextCell = currentCell.nextElementSibling;
            let curCellInfo = {
                cellIndex: currentCell.cellIndex,
                width: this.props.node.data.get('cellSizes')[currentCell.cellIndex],
            };
            let nextCellInfo = nextCell ? {
                cellIndex: nextCell.cellIndex,
                width: this.props.node.data.get('cellSizes')[nextCell.cellIndex],
            } : null;
            this.setState({
                isBorderMoving: true,
                mouseDownX: mouseCoords.mousePageX,
                currentCell: curCellInfo,
                nextCell: nextCellInfo,
            });
        } else if (this.isMouseInsideTable(e)) {
            let startCell = (e.target as any).closest('td, th');
            let startRow = (e.target as any).closest('tr');
            let curCell = (this.props.node.nodes.toArray()[startRow.rowIndex] as any).nodes.toArray()[startCell.cellIndex].nodes.toArray()[0];
            this.setState({
                isCellSelecting: true,
                firstSelectedCell: {
                    cellNumber: startCell.cellIndex,
                    rowNumber: startRow.rowIndex,
                },
                selectedCells: [curCell],
            });
        }

        if (!this.isMouseInsideTable(e) && !e.target.closest('.merge-cells-bar') && !e.target.closest('.uui-rte-tablebar')) {
            this.state.selectedCells.length > 0 && this.setState({selectedCells: []});
        }
    }

    getColumnsCount = () => {
        return this.props.node.nodes.toArray().reduce((accum: number, row: any) => row.nodes.size > accum ? row.nodes.size : accum, 0);
    }

    getTableWidth = () => {
        return (this.props.node.data.get('cellSizes') || DEFAULT_COLUMNS).reduce((summ: number, size: any) => summ += size);
    }

    render() {
        return <div className={ css.tableWrapper } ref={ (el) => this.tableWrapperNode = el }>
            <Broadcast value={ this.state.selectedCells } channel='uui-rte-table'>
                <table className={ css.table } style={ {width: `${this.getTableWidth()}px`} } ref={ (el) => this.tableNode = el }>
                    <colgroup>
                        { (this.props.node.data.get('cellSizes') || DEFAULT_COLUMNS).map((size: number, index: number) => {
                            let hoverStyle = this.state.hoverCellIndex === index ? { borderRight: '2px solid #008ACE' } : null;
                            return <col style={ { width: `${ size }px`, ...hoverStyle } } key={ `col-${ index }` } />;
                        }) }
                    </colgroup>
                    <tbody { ...this.props.attributes } className={ css.tableBody }>
                        { this.props.children }
                    </tbody>
                </table>
            </Broadcast>
            <MergeCellBar editor={ this.props.editor } selectedCells={ this.state.selectedCells } clearSelection={ () => this.setState({ selectedCells: [] }) } />
            <TableBar editor={ this.props.editor } isVisible={ this.state.selectedCells.length == 1 && this.props.isFocused } />
        </div>;
    }
}