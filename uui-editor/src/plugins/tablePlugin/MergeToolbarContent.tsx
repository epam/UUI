import React from 'react';

import { ReactComponent as TableMerge } from '../../icons/table-merge.svg';
import { ToolbarButton } from '../../implementation/ToolbarButton';
import { usePlateEditorState, TElementEntry, removeNodes, insertElements, getRange, findNode } from '@udecode/plate-common';
import { getCellTypes, getEmptyCellNode } from '@udecode/plate-table';
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

        // removes multiple cells with on same path.
        // once cell removed, next cell in the row will settle down on that path
        Object.values(cols).forEach((paths: any) => {
            paths?.forEach(() => {
                const validEntry = findNode(editor, {
                    at: paths[0],
                    match: { type: getCellTypes(editor) },
                });
                const validNode = validEntry?.[0] as ExtendedTTableCellElement;
                console.log('validNode', validNode);

                const shouldRemove = !!selectedCellEntries.find((entry) => {
                    const cellElem = entry[0] as ExtendedTTableCellElement;
                    if (cellElem === validNode) {
                        console.log('ar equal', validNode);
                    }

                    return cellElem === validNode;
                });

                if (validNode && shouldRemove) {
                    removeNodes(editor, { at: paths[0] });
                }
            });
        });

        console.log('paths', paths);

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
