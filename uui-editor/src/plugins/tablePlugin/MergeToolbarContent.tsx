import React from 'react';

import { ReactComponent as TableMerge } from '../../icons/table-merge.svg';
import { ToolbarButton } from '../../implementation/ToolbarButton';
import { usePlateEditorState, TElementEntry, removeNodes, insertElements } from '@udecode/plate-common';
import { getEmptyCellNode } from '@udecode/plate-table';
import { Path } from 'slate';
import { getColSpan, getRowSpan } from './utils';

export function MergeToolbarContent({ cellEntries: selectedCellEntries }: { cellEntries: TElementEntry[] }) {
    const editor = usePlateEditorState();

    const mergeCells = () => {
        // define colSpan
        const colSpan = selectedCellEntries.reduce((acc, [data, path]: any) => {
            if (path[1] === selectedCellEntries[0][1][1]) {
                const cellColSpan = getColSpan(data);
                return acc + cellColSpan;
            }
            return acc;
        }, 0);

        // define rowSpan
        const alreadyCounted: number[] = [];
        const rowSpan = selectedCellEntries.reduce((acc, [data, path]: any) => {
            const curRowCounted = alreadyCounted.includes(path[1]);
            if (path[1] !== selectedCellEntries[0][1][1] && !curRowCounted) {
                alreadyCounted.push(path[1]);

                const cellRowSpan = getRowSpan(data);
                return acc + cellRowSpan;
            }
            return acc;
        }, 1);

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
                removeNodes(editor, { at: paths[0] });
            });
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
