import React from 'react';

import { ReactComponent as TableMerge } from '../../icons/table-merge.svg';
import { ToolbarButton } from '../../implementation/ToolbarButton';
import { createCell, getColSpan, getRowSpan } from './utils';
import { usePlateEditorState, TElementEntry, removeNodes, insertElements, getRange } from '@udecode/plate-common';
import { TTableCellElement, getEmptyCellNode } from '@udecode/plate-table';
import { Path } from 'slate';

export function MergeToolbarContent({ cellEntries: selectedCellEntries }: { cellEntries: TElementEntry[] }) {
    const editor = usePlateEditorState();

    const mergeCells = () => {
        // const rowArray: any[] = [];
        // cellEntries.forEach(([, path]) => rowArray.push(path[2]));

        // // define colSpan
        // const colSpan = cellEntries.reduce((acc, [data, path]: any) => {
        //     if (path[1] === cellEntries[0][1][1]) {
        //         const cellColSpan = getColSpan(data);
        //         return acc + cellColSpan;
        //     }
        //     return acc;
        // }, 0);

        // // define rowSpan
        // const alreadyCounted: number[] = [];
        // const rowSpan = cellEntries.reduce((acc, [data, path]: any) => {
        //     const curRowCounted = alreadyCounted.includes(path[1]);
        //     if (path[1] !== cellEntries[0][1][1] && !curRowCounted) {
        //         alreadyCounted.push(path[1]);

        //         const cellRowSpan = getRowSpan(data);
        //         return acc + cellRowSpan;
        //     }
        //     return acc;
        // }, 1);

        // // cols to remove
        // const cols: any = {};
        // let hasHeaderCell = false;
        // cellEntries.forEach(([entry, path]) => {
        //     if (!hasHeaderCell && entry.type === 'table_header_cell') {
        //         hasHeaderCell = true;
        //     }
        //     if (cols[path[1]]) {
        //         cols[path[1]].push(path);
        //     } else {
        //         cols[path[1]] = [path];
        //     }
        // });

        // Object.values(cols).forEach((paths: any) => {
        //     paths?.forEach(() => {
        //         removeNodes(editor, { at: paths[0] });
        //     });
        // });

        // const textContent = cellEntries
        //     .map(([data]: any) => data?.children[0]?.children[0]?.text)
        //     .join(' ');
        // const mergedCell = createCell({
        //     rowSpan,
        //     colSpan,
        //     type: hasHeaderCell ? 'table_header_cell' : 'table_cell',
        //     textContent,
        // });

        // insertElements(editor, mergedCell, { at: cellEntries[0][1] });

        const {
            colSpan,
            rowSpan,
            // currentRowIndex: lastRowIndex,
            // currentColIndex: lastColIndex
        } = selectedCellEntries.reduce(
            (acc, current, index) => {
                const [el, path] = current;
                const cellElement: TTableCellElement = el;
                const [rowIndex, colIndex] = path.slice(-2);

                if (acc.currentRowIndex !== rowIndex || index === 0) {
                    acc.rowSpan += cellElement.rowSpan as number || 1;
                    acc.currentRowIndex = rowIndex;
                }

                if (colIndex > acc.currentColIndex || index === 0) {
                    acc.colSpan += cellElement.colSpan || 1;
                    acc.currentColIndex = colIndex;
                }

                return acc;
            },
            {
                colSpan: 0,
                rowSpan: 0,
                currentRowIndex: 0,
                currentColIndex: 0,
            },
        );

        console.log('colSpan11', colSpan);

        // const firstRowIndex = lastRowIndex + 1 - rowSpan;
        // console.log(
        //   'settings:',
        //   'rowSpan',
        //   rowSpan,
        //   'colSpan',
        //   colSpan,
        //   'lastRowIndex',
        //   lastRowIndex,
        //   'firstRowIndex',
        //   firstRowIndex
        // );

        const contents = [];

        const paths: Path[] = [];
        for (const cellEntry of selectedCellEntries) {
            const [el, path] = cellEntry;
            paths.push(path);
            contents.push(...el.children);
        }

        removeNodes(editor, {
            at: getRange(editor, paths.at(0)!, paths.at(-1)!),
            match: (_, path) => {
                if (paths.some((p) => Path.equals(p, path))) {
                    return true;
                }
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

        insertElements(editor, mergedCell, { at: selectedCellEntries[0][1] });
    };

    return (
        <ToolbarButton
            onClick={ mergeCells }
            icon={ TableMerge }
        />
    );
}
