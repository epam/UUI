import React from 'react';

import { ReactComponent as TableMerge } from '../../icons/table-merge.svg';
import { ToolbarButton } from '../../implementation/ToolbarButton';
import { usePlateEditorState, TElementEntry, removeNodes, insertElements, getRange } from '@udecode/plate-common';
import { getEmptyCellNode } from '@udecode/plate-table';
import { Path } from 'slate';
import { getColSpan, getRowSpan } from './utils';
import { ExtendedTTableCellElement } from './types';

export function MergeToolbarContent({ cellEntries: selectedCellEntries }: { cellEntries: TElementEntry[] }) {
    const editor = usePlateEditorState();

    const mergeCells = () => {
        const [startElem, startCellPath] = selectedCellEntries[0];
        console.log('selectedCellEntries', selectedCellEntries);
        // const startPath = selectedCellEntries[0][1];
        // const startCellEmen
        const startCellElem = startElem as ExtendedTTableCellElement;

        // define colSpan
        const colSpan = selectedCellEntries.reduce((acc, [data, path]: any) => {
            if (path[1] === startCellPath[1]) {
                const cellColSpan = getColSpan(data);
                return acc + cellColSpan;
            }
            return acc;
        }, 0);

        // define rowSpan
        const alreadyCounted: number[] = [];
        const rowSpan = selectedCellEntries.reduce((acc, [data, path]: any) => {
            const curRowCounted = alreadyCounted.includes(path[1]);
            if (path[1] !== startCellPath[1] && !curRowCounted) {
                alreadyCounted.push(path[1]);

                const cellRowSpan = getRowSpan(data);
                return acc + cellRowSpan;
            }
            return acc;
        }, 1);

        // const [startRowIndex, startColIndex] = startCellPath.slice(-2);

        const startRowIndex = startCellElem.rowIndex;
        const startColIndex = startCellElem.colIndex;
        const endRowIndex = startRowIndex + rowSpan - 1;
        const endColIndex = startColIndex + colSpan - 1;

        console.log('dimensions', startRowIndex, startColIndex, endRowIndex, endColIndex);

        // console.log('startPath', startCellPath.slice(-2));
        // console.log('dimensions', rowSpan, colSpan);

        const contents = [];
        const paths: Path[] = [];
        for (const cellEntry of selectedCellEntries) {
            const [el, path] = cellEntry;
            paths.push(path);
            contents.push(...el.children); // TODO: make deep clone here
        }

        const cols: any = {};
        let hasHeaderCell = false;
        selectedCellEntries.forEach(([entry, path]) => {
            if (!hasHeaderCell && entry.type === 'table_header_cell') {
                hasHeaderCell = true;
            }
            if (cols[path[1]]) {
                cols[path[1]].push(path);
            } else {
                cols[path[1]] = [path];
            }
        });

        // // removes multiple cells with on same path.
        // // once cell removed, next cell in the row will settle down on that path
        // Object.values(cols).forEach((paths: any) => {
        //     paths?.forEach(() => {
        //         removeNodes(editor, { at: paths[0] });
        //     });
        // });

        removeNodes(editor, {
            at: getRange(editor, paths.at(0)!, paths.at(-1)!),
            match: (element, path) => {
                if (element.type === 'table_cell' || element.type === 'table_header_cell') {
                    const currentCellElem = element as ExtendedTTableCellElement;
                    // console.log('comparing', element);

                    return !!selectedCellEntries.find((entry) => {
                        const cellElem = entry[0] as ExtendedTTableCellElement;
                        if (cellElem === element) {
                            console.log('ar equal', element);
                        }
                        // Path.equals(p, path)
                        return cellElem === element;
                    });

                    // const curEndingRowIndex = currentCellElem.rowIndex + currentCellElem.rowSpan - 1;
                    // const curEndingColIndex = currentCellElem.colIndex + currentCellElem.colSpan - 1;

                    // if (
                    //     startRowIndex >= currentCellElem.rowIndex
                    //      && startColIndex >= currentCellElem.colIndex
                    //        && endRowIndex <= curEndingRowIndex
                    //         && endColIndex <= curEndingColIndex
                    // ) {
                    //     return true;
                    // }

                    // if (
                    //     currentCellElem.rowIndex >= startRowIndex
                    //      && currentCellElem.colIndex >= startColIndex
                    // //    && endRowIndex <= curEndingRowIndex
                    // //     && endColIndex <= curEndingColIndex
                    // ) {
                    //     console.log('current to delete', element);
                    //     return true;
                    // }

                    // const _startRowIndex = element.rowIndex;
                    // const _endRowIndex = endCell.rowIndex + endCell.rowSpan - 1;
                    // const _startColIndex = element.colIndex;
                    // const _endColIndex = endCell.colIndex + endCell.colSpan - 1;
                }

                // if (paths.some((p) => Path.equals(p, path))) {
                //     return true;
                // }
                return false;
            },
        });

        const mergedCell = {
            ...getEmptyCellNode(editor, {
                header: selectedCellEntries[0][0].type === 'th',
                newCellChildren: contents,
            }),
            colSpan,
            rowSpan,
        };

        insertElements(editor, mergedCell, { at: startCellPath });
    };

    return (
        <ToolbarButton
            onClick={ mergeCells }
            icon={ TableMerge }
        />
    );
}
