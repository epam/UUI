import { Editor, Block, KeyUtils } from 'slate';

export const mergeCellsPlugin = () => {

    const getCellIndex = (editor: Editor, cell: any) => {
        let elemPosition = 0;
        let counter = 0;
        (editor.value.document as any).getParent(cell.key).nodes.toArray().forEach((elem: any) => {
            cell.key === elem.key ? elemPosition = counter : counter += 1;
        });

        return elemPosition;
    };

    const getTotalColSpanValue = (mergedCells: any[], typeOfMerge: string, mergedColumns: any[]) => {
        if (typeOfMerge === 'horizontal') {
            return mergedCells.reduce((accumulator: number, cell: any) => {
                if (cell.data.get('style') == 'none') {
                    return accumulator;
                }

                if (!cell.data.get('colSpan')) {
                    return ++accumulator;
                } else if (cell.data.get('colSpan') > 0) {
                    return accumulator += cell.data.get('colSpan');
                }
            }, 0);
        }

        if (typeOfMerge === 'vertical') {
            return mergedCells.reduce((accumulator: number, cell: any) => {
                if (cell.data.get('style') == 'none') {
                    return accumulator;
                }

                if (cell.data.get('colSpan') > 1) {
                    return accumulator += cell.data.get('colSpan') - 1;
                }
            }, 0);
        }

        if (typeOfMerge === 'combine') {
            return mergedColumns.reduce((accumulator: number, cell: any) => {
                if (cell.data.get('style') == 'none') {
                    return accumulator;
                }

                if (!cell.data.get('colSpan')) {
                    return ++accumulator;
                } else if (cell.data.get('colSpan') >= 1) {
                    return accumulator += cell.data.get('colSpan');
                }
            }, 0);
        }
    };

    const getTotalRowSpanValue = (mergedCells: any[], typeOfMerge: string, mergedRows: any[]) => {
        if (typeOfMerge === 'horizontal') {
            return mergedCells.reduce((accumulator: number, cell: any) => {
                if (cell.data.get('style') == 'none') {
                    return accumulator;
                }

                if (cell.data.get('rowSpan') > 1) {
                    return accumulator += cell.data.get('rowSpan') - 1;
                }
            }, 0);
        }

        if (typeOfMerge === 'vertical') {
            return mergedCells.reduce((accumulator: number, cell: any) => {
                if (cell.data.get('style') == 'none') {
                    return accumulator;
                }

                if (!cell.data.get('rowSpan')) {
                    return ++accumulator;
                } else if (cell.data.get('rowSpan') > 0) {
                    return accumulator += cell.data.get('rowSpan');
                }
            }, 0);
        }

        if (typeOfMerge === 'combine') {
            return mergedRows.reduce((accumulator: number, cell: any) => {
                if (cell.data.get('style') == 'none') {
                    return accumulator;
                }

                if (!cell.data.get('rowSpan')) {
                    return ++accumulator;
                } else if (cell.data.get('rowSpan') >= 1) {
                    return accumulator += cell.data.get('rowSpan');
                }
            }, 0);
        }
    };

    const createNewCell = (cellType: string, key?: string, data?: any) => {
        const emptyParagraph = Block.create({
            object: 'block',
            type: 'paragraph',
            key: KeyUtils.create(),
        });

        return Block.create({
            object: 'block',
            type: cellType,
            key: key || KeyUtils.create(),
            nodes: [emptyParagraph],
            data: data || {
                colSpan: 1,
                rowSpan: 1,
            },
        });
    };

    const updateCellStyle = async (editor: Editor, updatingCell: any, mergedCells: any, typeOfMerge: string, trElements: any, tdArrayIndex: any) => {
        const selectedParent = trElements[0];
        const selectedIndex = tdArrayIndex[0];

        let mergedRows: any = mergedCells.filter((cell: any, index: number) => selectedIndex === tdArrayIndex[index]);
        let mergedColumns: any = mergedCells.filter((row: any, index: number) => selectedParent.key === trElements[index].key);

        let colspanValue = getTotalColSpanValue(mergedCells, typeOfMerge, mergedColumns);
        let rowspanValue = getTotalRowSpanValue(mergedCells, typeOfMerge, mergedRows);

        const updatedData = {
            colSpan: colspanValue || 1,
            rowSpan: rowspanValue || 1,
        };

        editor.setNodeByKey(updatingCell.key, {
            ...updatingCell as any,
            data: updatedData,
        });
    };

    const isCellWithValidStructure = (cell: any, currentColSpan: number, currentRowSpan: number) => {
        return (cell &&
            (
                cell.data.get('style') === 'none' ||
                (cell.data.get('colSpan') > 1 && cell.data.get('colSpan') <= currentColSpan) ||
                (cell.data.get('rowSpan') > 1 && cell.data.get('rowSpan') <= currentRowSpan)
            ));
    };

    const unmergeCells = (editor: Editor, props: any, selectedCells: any[]) => {
        selectedCells.map((selectedCell: any) => {
            let cell: any = editor.value.document.getParent(selectedCell.key);
            let row: any = editor.value.document.getParent(cell.key);
            let table: any = editor.value.document.getParent(row.key);
            let rowIndex = 0;
            let cellIndex = getCellIndex(editor, cell);
            let rowSpan = cell.data.get('rowSpan') || 1;
            let colSpan = cell.data.get('colSpan') || 1;

            if (colSpan > 1 || rowSpan > 1) {
                for (let i = 0; i < table.nodes.toArray().length; i++) {
                    if (table.nodes.toArray()[i].key === row.key) {
                        rowIndex = i;
                    }
                }

                for (let i = rowIndex; i < rowIndex + +rowSpan; i++) {
                    for (let j = cellIndex; j < cellIndex + +colSpan; j++) {
                        let item = table.nodes.toArray()[i].nodes.toArray()[j];

                        if (isCellWithValidStructure(item, colSpan, rowSpan)) {
                            props.editor.setNodeByKey(item.key, {
                                ...item,
                                data: {},
                            });
                        } else {
                            const newCellNode = createNewCell(table.nodes.toArray()[rowIndex].nodes.toArray()[cellIndex].type);

                            editor.insertNodeByKey(table.nodes.toArray()[i].key, j, newCellNode);
                        }
                    }
                }
            }
        });
    };

    const mergeCells = (editor: Editor, props: any, selectedCells: any[]) => {
        let typeOfMerge = 'combine';

        // logic for preventing header and body merging
        let isNotValidMerge = selectedCells.some((cell: any) => cell.type === "table_header_cell") && selectedCells.some((cell: any) => cell.type === "table_cell");

        let tdArray: any = [];

        if (isNotValidMerge || selectedCells.length === 1) {
            return;
        }

        const newHeaderCellNode = createNewCell('table_header_cell');
        const newCellNode = createNewCell('table_cell');
        let isCellsInOneRow = editor.value.document.getParent(selectedCells[0].key).key === editor.value.document.getParent(selectedCells[selectedCells.length - 1].key).key;
        let isCellsInOneColumn = getCellIndex(editor, selectedCells[0]) === getCellIndex(editor, selectedCells[selectedCells.length - 1]);
        let firstCell: any = selectedCells[0];

        if (isCellsInOneRow) {
            tdArray = selectedCells;
            typeOfMerge = 'horizontal';

            let rowSpanZeroValue = firstCell.data.get('rowSpan') || 1;
            let isHorizontal = true;

            if (rowSpanZeroValue !== 1) {
                isHorizontal = false;
            } else {
                isHorizontal = !selectedCells.some((elem: any) => elem.data.get('rowSpan') && elem.data.get('rowSpan') !== rowSpanZeroValue);
            }

            if (!isHorizontal) {
                typeOfMerge = 'combine';
            }
        } else if (isCellsInOneColumn) {
            let colSpanZeroValue = firstCell.data.get('colSpan') || 1;
            let isVertical = true;
            typeOfMerge = 'vertical';

            if (colSpanZeroValue !== 1) {
                isVertical = false;
            } else {
                isVertical = !selectedCells.some((elem: any) => elem.data.get('colSpan') && elem.data.get('colSpan') !== colSpanZeroValue);
            }

            if (!isVertical) {
                typeOfMerge = 'combine';
            } else {
                tdArray = selectedCells.filter((elem: any) => getCellIndex(editor, elem) === getCellIndex(editor, selectedCells[0]));
            }
        }

        if (typeOfMerge === 'combine') {
            tdArray = selectedCells;
        }

        let trElements: any = tdArray.map((elem: any) => editor.value.document.getParent(editor.value.document.getPath(elem.key)));
        let tdArrayIndex: any = tdArray.map((elem: any) => getCellIndex(editor, elem));
        let textFromCells = tdArray.map((elem: { text: any }) => elem.text).join(' ');
        let requiredNode = tdArray[0].type === 'table_cell' ? newCellNode : newHeaderCellNode;

        editor.replaceNodeByKey(tdArray[0], requiredNode);

        const updatedCell: any = editor.value.document.getNode(requiredNode.key);
        const updatedCellPath = editor.value.document.getPath(updatedCell.nodes.toArray()[0].nodes.toArray()[0]);

        editor.insertTextByPath(updatedCellPath, 0, textFromCells);
        updateCellStyle(editor, requiredNode, tdArray, typeOfMerge, trElements, tdArrayIndex);


        for (let i = 1; i < tdArray.length; i++) {
            const deletedNode = createNewCell(tdArray[i].type, tdArray[i].key, { style: 'none' });
            editor.replaceNodeByKey(tdArray[i].key, deletedNode);
        }
    };

    return {
        queries: {
            mergeCells,
            getCellIndex,
            unmergeCells,
        },
    };
};